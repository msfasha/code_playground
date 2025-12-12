#!/bin/bash

# RTDWMS System Startup Script
# Starts both backend and frontend services

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Stop any process listening on a TCP port (best-effort).
kill_listeners_on_port() {
    local port="$1"
    local name="$2"

    local pids
    pids="$(lsof -t -iTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
    if [ -z "$pids" ]; then
        return 0
    fi

    echo -e "${YELLOW}${name}: Port ${port} is in use. Stopping existing process(es): ${pids}${NC}"
    # Try graceful stop first
    kill $pids 2>/dev/null || true

    # Wait up to ~5s
    for i in {1..10}; do
        sleep 0.5
        if ! lsof -t -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
            echo -e "${GREEN}${name}: Port ${port} is free.${NC}"
            return 0
        fi
    done

    echo -e "${YELLOW}${name}: Still running on port ${port}. Forcing stop...${NC}"
    kill -9 $pids 2>/dev/null || true
    sleep 0.5
    return 0
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    if [ -n "${BACKEND_PID:-}" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
        wait "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "${FRONTEND_PID:-}" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
        wait "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo -e "${GREEN}Services stopped.${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}RTDWMS System Startup${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if database is running
echo -e "\n${YELLOW}Checking database...${NC}"
if ! docker ps | grep -q rtdwms_db; then
    echo -e "${YELLOW}Database container not running. Starting...${NC}"
    docker-compose up -d
    echo -e "${YELLOW}Waiting for database to be ready...${NC}"
    sleep 5
else
    echo -e "${GREEN}Database container is running.${NC}"
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${RED}Virtual environment not found. Please create it first:${NC}"
    echo -e "${YELLOW}python3 -m venv venv${NC}"
    echo -e "${YELLOW}source venv/bin/activate${NC}"
    echo -e "${YELLOW}pip install -r requirements.txt${NC}"
    exit 1
fi

# Start Backend
echo -e "\n${BLUE}Starting Backend...${NC}"
cd backend
source ../venv/bin/activate

# Restart backend if port is already in use
kill_listeners_on_port 8000 "Backend"

echo -e "${GREEN}Starting FastAPI backend on http://localhost:8000${NC}"
uvicorn main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"
echo -e "${BLUE}Backend logs: tail -f backend.log${NC}"

cd ..

# Start Frontend
echo -e "\n${BLUE}Starting Frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules not found. Installing dependencies...${NC}"
    npm install
fi

# Check if port 5173 is in use
# Restart frontend if port is already in use
kill_listeners_on_port 5173 "Frontend"

echo -e "${GREEN}Starting React frontend on http://localhost:5173${NC}"
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started (PID: $FRONTEND_PID)${NC}"
echo -e "${BLUE}Frontend logs: tail -f frontend.log${NC}"

cd ..

# Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}System Started Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Backend:${NC}   http://localhost:8000"
echo -e "${BLUE}Frontend:${NC}  http://localhost:5173"
echo -e "${BLUE}API Docs:${NC}  http://localhost:8000/docs"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"
echo -e "${YELLOW}View logs: tail -f backend.log frontend.log${NC}\n"

# Wait for processes
wait

