#!/bin/bash
# DocMiner Virtual Environment Activation Script

echo "🐍 Activating DocMiner Python virtual environment..."
source venv/bin/activate

echo "✅ Virtual environment activated!"
echo "📦 Installed packages:"
pip list | grep -E "(fastapi|chromadb|sentence-transformers|uvicorn)"

echo ""
echo "🚀 To start the backend server:"
echo "   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "🌐 To start the frontend:"
echo "   cd client && npm install && npm run dev"
echo ""
echo "📖 See README_SETUP.md for detailed instructions"

