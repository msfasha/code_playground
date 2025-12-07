from sentence_transformers import SentenceTransformer
from typing import List
import os

class EmbeddingService:
    """Generate embeddings for text chunks using multilingual model"""
    
    def __init__(self):
        # Use multilingual model that supports Arabic and English
        self.model_name = "paraphrase-multilingual-MiniLM-L12-v2"
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the embedding model"""
        try:
            print(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            # Fallback to a smaller model if the main one fails
            try:
                print("Trying fallback model...")
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                print("Fallback model loaded")
            except Exception as e2:
                raise Exception(f"Failed to load any embedding model: {e2}")
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts"""
        if not self.model:
            raise Exception("Embedding model not loaded")
        
        try:
            # Generate embeddings
            embeddings = self.model.encode(texts, convert_to_tensor=False)
            return embeddings.tolist()
        except Exception as e:
            raise Exception(f"Error generating embeddings: {str(e)}")
    
    def generate_single_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        return self.generate_embeddings([text])[0]
    
    def get_model_info(self) -> dict:
        """Get information about the loaded model"""
        return {
            "model_name": self.model_name,
            "max_seq_length": getattr(self.model, 'max_seq_length', 512),
            "dimension": self.model.get_sentence_embedding_dimension() if self.model else None
        }

