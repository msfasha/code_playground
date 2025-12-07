import os
import PyPDF2
from docx import Document
from langdetect import detect
from typing import Tuple, Optional

class DocumentParser:
    """Parse documents and extract text content"""
    
    @staticmethod
    def parse_pdf(file_path: str) -> Tuple[str, str]:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    if page_text.strip():
                        text += f"\n--- Page {page_num + 1} ---\n{page_text}\n"
                
                # Detect language
                language = DocumentParser._detect_language(text)
                return text, language
                
        except Exception as e:
            raise Exception(f"Error parsing PDF: {str(e)}")
    
    @staticmethod
    def parse_docx(file_path: str) -> Tuple[str, str]:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = ""
            
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text += paragraph.text + "\n"
            
            # Detect language
            language = DocumentParser._detect_language(text)
            return text, language
            
        except Exception as e:
            raise Exception(f"Error parsing DOCX: {str(e)}")
    
    @staticmethod
    def parse_txt(file_path: str) -> Tuple[str, str]:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
            
            # Detect language
            language = DocumentParser._detect_language(text)
            return text, language
            
        except Exception as e:
            raise Exception(f"Error parsing TXT: {str(e)}")
    
    @staticmethod
    def parse_document(file_path: str) -> Tuple[str, str]:
        """Parse document based on file extension"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.pdf':
            return DocumentParser.parse_pdf(file_path)
        elif file_extension == '.docx':
            return DocumentParser.parse_docx(file_path)
        elif file_extension == '.txt':
            return DocumentParser.parse_txt(file_path)
        else:
            raise Exception(f"Unsupported file type: {file_extension}")
    
    @staticmethod
    def _detect_language(text: str) -> str:
        """Detect language of text"""
        try:
            # Take first 1000 characters for language detection
            sample_text = text[:1000] if len(text) > 1000 else text
            if not sample_text.strip():
                return "unknown"
            
            detected = detect(sample_text)
            return detected
        except:
            return "unknown"

