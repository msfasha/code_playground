import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict, Optional
import uuid
from datetime import datetime

class VectorStore:
    """ChromaDB vector store for document embeddings"""
    
    def __init__(self, persist_directory: str = "data/chroma_db"):
        """Initialize ChromaDB client"""
        self.persist_directory = persist_directory
        
        # Create directory if it doesn't exist
        os.makedirs(persist_directory, exist_ok=True)
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"description": "Document chunks with embeddings"}
        )
    
    def add_documents(self, chunks: List[Dict]) -> int:
        """Add document chunks to the vector store"""
        if not chunks:
            return 0
        
        # Prepare data for ChromaDB
        texts = [chunk["text"] for chunk in chunks]
        metadatas = [chunk["metadata"] for chunk in chunks]
        ids = [str(uuid.uuid4()) for _ in chunks]
        
        try:
            # Add to collection
            self.collection.add(
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )
            return len(chunks)
        except Exception as e:
            raise Exception(f"Error adding documents to vector store: {str(e)}")
    
    def search_documents(self, query: str, n_results: int = 10, filter_metadata: Optional[Dict] = None) -> List[Dict]:
        """Search for similar documents"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results,
                where=filter_metadata
            )
            
            # Format results
            documents = []
            if results['documents'] and results['documents'][0]:
                for i, doc in enumerate(results['documents'][0]):
                    documents.append({
                        "text": doc,
                        "metadata": results['metadatas'][0][i],
                        "distance": results['distances'][0][i] if 'distances' in results else None
                    })
            
            return documents
        except Exception as e:
            raise Exception(f"Error searching documents: {str(e)}")
    
    def get_all_documents(self, limit: Optional[int] = None) -> List[Dict]:
        """Get all documents from the collection"""
        try:
            results = self.collection.get(limit=limit)
            
            documents = []
            if results['documents']:
                for i, doc in enumerate(results['documents']):
                    documents.append({
                        "id": results['ids'][i],
                        "text": doc,
                        "metadata": results['metadatas'][i]
                    })
            
            return documents
        except Exception as e:
            raise Exception(f"Error getting documents: {str(e)}")
    
    def delete_documents_by_filename(self, filename: str) -> int:
        """Delete all documents with a specific filename"""
        try:
            # Get documents with the filename
            results = self.collection.get(
                where={"filename": filename}
            )
            
            if results['ids']:
                # Delete the documents
                self.collection.delete(ids=results['ids'])
                return len(results['ids'])
            
            return 0
        except Exception as e:
            raise Exception(f"Error deleting documents: {str(e)}")
    
    def get_collection_stats(self) -> Dict:
        """Get statistics about the collection"""
        try:
            count = self.collection.count()
            return {
                "total_documents": count,
                "collection_name": self.collection.name
            }
        except Exception as e:
            raise Exception(f"Error getting collection stats: {str(e)}")
    
    def get_documents_by_filename(self, filename: str) -> List[Dict]:
        """Get all documents with a specific filename"""
        try:
            results = self.collection.get(
                where={"filename": filename}
            )
            
            documents = []
            if results['documents']:
                for i, doc in enumerate(results['documents']):
                    documents.append({
                        "id": results['ids'][i],
                        "text": doc,
                        "metadata": results['metadatas'][i]
                    })
            
            return documents
        except Exception as e:
            raise Exception(f"Error getting documents by filename: {str(e)}")

