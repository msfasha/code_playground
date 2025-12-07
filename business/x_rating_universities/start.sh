#!/bin/bash

# Jordan Universities Rating System - Startup Script

echo "🎓 Starting Jordan Universities Rating System..."
echo "================================================"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/lib/python*/site-packages/flask" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
fi

# Start the application
echo "🚀 Starting Flask application..."
echo "📍 Application will be available at: http://localhost:5001"
echo "🛑 Press Ctrl+C to stop the application"
echo ""

python app.py 