# DocMiner - Phase 1 Setup Guide

## Overview
DocMiner is a document indexing and retrieval system that supports both Arabic and English documents. This Phase 1 implementation provides basic document upload, indexing, and search functionality.

## Features
- ✅ Upload PDF, DOCX, and TXT files
- ✅ Automatic language detection (Arabic/English)
- ✅ Intelligent text chunking
- ✅ Multilingual embeddings using sentence-transformers
- ✅ Local vector database with ChromaDB
- ✅ Web interface for file upload and document browsing
- ✅ Basic search functionality

## Project Structure
```
0_DocMiner/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/routes/     # API endpoints
│   │   ├── models/         # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── main.py        # FastAPI app
│   └── requirements.txt
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── App.tsx
│   └── package.json
└── data/
    └── chroma_db/         # Vector database storage
```

## Setup Instructions

### 1. Backend Setup

```bash
# Activate the virtual environment (already created)
source activate_venv.sh

# Or manually:
# source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run the server
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. First Run

1. Start the backend server first
2. Start the frontend development server
3. Open `http://localhost:5173` in your browser
4. Upload some documents to test the system

## API Endpoints

### Document Management
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents/list` - List all indexed documents
- `DELETE /api/documents/{filename}` - Delete a document
- `GET /api/documents/stats` - Get collection statistics

### Search
- `GET /api/documents/search` - Search documents by query

## Usage

### Uploading Documents
1. Go to the "Upload Documents" tab
2. Drag and drop files or click to select
3. Supported formats: PDF, DOCX, TXT
4. The system will automatically:
   - Extract text content
   - Detect language (Arabic/English)
   - Chunk the text intelligently
   - Generate embeddings
   - Store in the vector database

### Browsing Documents
1. Go to the "Browse & Search" tab
2. View all indexed documents
3. See chunk information and metadata
4. Delete documents if needed

### Searching
1. Click the "Search" button in the documents tab
2. Enter your search query
3. Optionally filter by language
4. View search results with similarity scores

## Technical Details

### Text Processing
- **Language Detection**: Uses `langdetect` library
- **Chunking**: Paragraph-based with 1000 character limit and 100 character overlap
- **Embeddings**: `paraphrase-multilingual-MiniLM-L12-v2` model (supports 50+ languages)

### Vector Database
- **Storage**: ChromaDB with local persistence
- **Similarity**: Cosine similarity for search
- **Metadata**: Filename, language, chunk index, upload date, word count

### Supported Languages
- Arabic (ar)
- English (en)
- Mixed documents (detected per chunk)

## Troubleshooting

### Common Issues

1. **Model Download**: The embedding model will be downloaded on first run (~420MB)
2. **File Size**: Large files may take time to process
3. **Memory**: Ensure sufficient RAM for embedding generation
4. **Ports**: Make sure ports 8000 and 5173 are available

### Performance Tips
- Start with smaller documents for testing
- The system processes files sequentially
- Embedding generation is the most time-consuming step

## Next Steps (Future Phases)

- **Phase 2**: Advanced search with filters and ranking
- **Phase 3**: LLM integration for Q&A over documents
- **Phase 4**: CrewAI agents for document generation
- **Phase 5**: Web scraping and research capabilities

## Development Notes

- Backend uses FastAPI with async support
- Frontend uses React with TypeScript and Tailwind CSS
- Vector database is stored locally in `data/chroma_db/`
- All processing happens locally (no external API calls)
- Supports both RTL (Arabic) and LTR (English) text display
