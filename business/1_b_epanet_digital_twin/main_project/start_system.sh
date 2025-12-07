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

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID 2>/dev/null || true
    wait $FRONTEND_PID 2>/dev/null || true
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
    echo -e "${YELLOW}pip install -r backend/requirements.txt${NC}"
    exit 1
fi

# Start Backend
echo -e "\n${BLUE}Starting Backend...${NC}"
cd backend
source ../venv/bin/activate

# Check if port 8000 is in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}Port 8000 is already in use. Backend may already be running.${NC}"
else
    echo -e "${GREEN}Starting FastAPI backend on http://localhost:8000${NC}"
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"
    echo -e "${BLUE}Backend logs: tail -f backend.log${NC}"
fi

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
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}Port 5173 is already in use. Frontend may already be running.${NC}"
else
    echo -e "${GREEN}Starting React frontend on http://localhost:5173${NC}"
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}Frontend started (PID: $FRONTEND_PID)${NC}"
    echo -e "${BLUE}Frontend logs: tail -f frontend.log${NC}"
fi

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

