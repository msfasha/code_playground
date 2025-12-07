import re
from typing import List, Dict
from datetime import datetime

class TextChunker:
    """Chunk text into smaller pieces for embedding"""
    
    def __init__(self, max_chars: int = 1000, overlap: int = 100):
        self.max_chars = max_chars
        self.overlap = overlap
    
    def chunk_text(self, text: str, filename: str, language: str) -> List[Dict]:
        """Chunk text into smaller pieces with metadata"""
        chunks = []
        
        # Clean and normalize text
        text = self._clean_text(text)
        
        # Split by paragraphs first
        paragraphs = self._split_by_paragraphs(text)
        
        current_chunk = ""
        chunk_index = 0
        
        for paragraph in paragraphs:
            # If adding this paragraph would exceed max_chars, save current chunk
            if len(current_chunk) + len(paragraph) > self.max_chars and current_chunk:
                chunks.append(self._create_chunk_metadata(
                    current_chunk, filename, language, chunk_index
                ))
                chunk_index += 1
                
                # Start new chunk with overlap
                current_chunk = self._get_overlap(current_chunk) + paragraph
            else:
                current_chunk += "\n" + paragraph if current_chunk else paragraph
        
        # Add the last chunk if it has content
        if current_chunk.strip():
            chunks.append(self._create_chunk_metadata(
                current_chunk, filename, language, chunk_index
            ))
        
        return chunks
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters that might interfere with chunking
        text = re.sub(r'[^\w\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF.,!?;:()[]{}"\'-]', '', text)
        return text.strip()
    
    def _split_by_paragraphs(self, text: str) -> List[str]:
        """Split text by paragraphs, respecting both Arabic and English"""
        # Split by double newlines, but also by single newlines if they seem like paragraph breaks
        paragraphs = re.split(r'\n\s*\n', text)
        
        # Further split long paragraphs by sentences
        result = []
        for para in paragraphs:
            if len(para) > self.max_chars:
                # Split by sentences (both Arabic and English punctuation)
                sentences = re.split(r'[.!?؛،]\s+', para)
                current_sentence_group = ""
                
                for sentence in sentences:
                    if len(current_sentence_group) + len(sentence) > self.max_chars:
                        if current_sentence_group:
                            result.append(current_sentence_group.strip())
                        current_sentence_group = sentence
                    else:
                        current_sentence_group += " " + sentence if current_sentence_group else sentence
                
                if current_sentence_group.strip():
                    result.append(current_sentence_group.strip())
            else:
                result.append(para.strip())
        
        return [p for p in result if p.strip()]
    
    def _get_overlap(self, text: str) -> str:
        """Get the last part of text for overlap"""
        if len(text) <= self.overlap:
            return text
        return text[-self.overlap:]
    
    def _create_chunk_metadata(self, text: str, filename: str, language: str, chunk_index: int) -> Dict:
        """Create metadata for a chunk"""
        return {
            "text": text,
            "metadata": {
                "filename": filename,
                "language": language,
                "chunk_index": chunk_index,
                "upload_date": datetime.now().isoformat(),
                "word_count": len(text.split()),
                "char_count": len(text)
            }
        }

