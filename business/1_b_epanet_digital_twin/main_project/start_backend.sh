#!/bin/bash

# Start Backend Only

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if database is running
if ! docker ps | grep -q rtdwms_db; then
    echo "Starting database..."
    docker-compose up -d
    sleep 5
fi

# Activate virtual environment
if [ ! -d "venv" ]; then
    echo "Error: Virtual environment not found. Please create it first."
    exit 1
fi

cd backend
source ../venv/bin/activate

echo "Starting FastAPI backend on http://localhost:8000"
echo "API docs: http://localhost:8000/docs"
echo "Press Ctrl+C to stop"

uvicorn main:app --reload --host 0.0.0.0 --port 8000

