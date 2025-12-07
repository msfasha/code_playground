from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List, Optional
import os
import tempfile
from datetime import datetime

from app.services.document_parser import DocumentParser
from app.services.chunking import TextChunker
from app.services.embeddings import EmbeddingService
from app.services.vector_store import VectorStore
from app.models.schemas import (
    DocumentUploadResponse, 
    DocumentListResponse, 
    DocumentDeleteResponse,
    DocumentChunk
)

router = APIRouter()

# Initialize services
document_parser = DocumentParser()
chunker = TextChunker(max_chars=1000, overlap=100)
embedding_service = EmbeddingService()
vector_store = VectorStore()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and index a document"""
    try:
        # Validate file type
        allowed_extensions = ['.pdf', '.docx', '.txt']
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed: {allowed_extensions}"
            )
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Parse document
            text, language = document_parser.parse_document(temp_file_path)
            
            if not text.strip():
                raise HTTPException(status_code=400, detail="No text content found in document")
            
            # Chunk the text
            chunks = chunker.chunk_text(text, file.filename, language)
            
            if not chunks:
                raise HTTPException(status_code=400, detail="No chunks created from document")
            
            # Generate embeddings for all chunks
            texts = [chunk["text"] for chunk in chunks]
            embeddings = embedding_service.generate_embeddings(texts)
            
            # Add embeddings to chunks
            for i, chunk in enumerate(chunks):
                chunk["embedding"] = embeddings[i]
            
            # Store in vector database
            chunks_added = vector_store.add_documents(chunks)
            
            return DocumentUploadResponse(
                success=True,
                message=f"Document '{file.filename}' indexed successfully",
                document_id=file.filename,
                chunks_created=chunks_added
            )
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

@router.get("/list", response_model=DocumentListResponse)
async def list_documents(
    limit: Optional[int] = Query(None, description="Maximum number of documents to return"),
    filename: Optional[str] = Query(None, description="Filter by filename")
):
    """List all indexed documents"""
    try:
        if filename:
            documents = vector_store.get_documents_by_filename(filename)
        else:
            documents = vector_store.get_all_documents(limit=limit)
        
        # Convert to response format
        document_chunks = []
        for doc in documents:
            document_chunks.append(DocumentChunk(
                id=doc["id"],
                text=doc["text"],
                metadata=doc["metadata"]
            ))
        
        return DocumentListResponse(
            documents=document_chunks,
            total_count=len(document_chunks)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")

@router.delete("/{filename}", response_model=DocumentDeleteResponse)
async def delete_document(filename: str):
    """Delete all chunks of a specific document"""
    try:
        deleted_count = vector_store.delete_documents_by_filename(filename)
        
        if deleted_count == 0:
            raise HTTPException(status_code=404, detail=f"Document '{filename}' not found")
        
        return DocumentDeleteResponse(
            success=True,
            message=f"Deleted {deleted_count} chunks for document '{filename}'"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")

@router.get("/stats")
async def get_stats():
    """Get collection statistics"""
    try:
        stats = vector_store.get_collection_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

@router.get("/search")
async def search_documents(
    query: str = Query(..., description="Search query"),
    n_results: int = Query(10, description="Number of results to return"),
    language: Optional[str] = Query(None, description="Filter by language")
):
    """Search for similar documents"""
    try:
        filter_metadata = {"language": language} if language else None
        results = vector_store.search_documents(query, n_results, filter_metadata)
        
        return {
            "query": query,
            "results": results,
            "count": len(results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching documents: {str(e)}")

