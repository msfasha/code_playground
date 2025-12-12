#!/bin/bash

# Start Frontend Only

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting React frontend on http://localhost:5173"
echo "Press Ctrl+C to stop"

npm run dev

