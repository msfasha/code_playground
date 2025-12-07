#!/usr/bin/env python3
"""
PDF Technical Requirements Extractor
Extracts technical requirements and compliance responses from PDF documents
based on the template format shown in the image.
"""

import re
import csv
import PyPDF2
import pdfplumber
from pathlib import Path
import pandas as pd
from typing import List, Dict, Tuple
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TechnicalRequirementsExtractor:
    def __init__(self):
        self.extracted_items = []
        
    def extract_with_pdfplumber(self, pdf_path: str) -> List[Dict]:
        """
        Extract requirements using pdfplumber for better text extraction
        """
        items = []
        
        try:
            with pdfplumber.open(pdf_path) as pdf:
                logger.info(f"Processing {len(pdf.pages)} pages with pdfplumber...")
                
                current_item = {}
                page_text = ""
                
                for page_num, page in enumerate(pdf.pages, 1):
                    logger.info(f"Processing page {page_num}/{len(pdf.pages)}")
                    
                    # Extract text from page
                    text = page.extract_text()
                    if text:
                        page_text += text + "\n"
                        
                        # Process accumulated text for complete items
                        items.extend(self.parse_requirements_text(page_text, page_num))
                        
        except Exception as e:
            logger.error(f"Error with pdfplumber: {e}")
            
        return items
    
    def extract_with_pypdf2(self, pdf_path: str) -> List[Dict]:
        """
        Fallback extraction using PyPDF2
        """
        items = []
        
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                logger.info(f"Processing {len(pdf_reader.pages)} pages with PyPDF2...")
                
                full_text = ""
                for page_num, page in enumerate(pdf_reader.pages, 1):
                    logger.info(f"Processing page {page_num}/{len(pdf_reader.pages)}")
                    text = page.extract_text()
                    if text:
                        full_text += text + "\n"
                
                # Parse the accumulated text
                items = self.parse_requirements_text(full_text)
                
        except Exception as e:
            logger.error(f"Error with PyPDF2: {e}")
            
        return items
    
    def parse_requirements_text(self, text: str, page_num: int = None) -> List[Dict]:
        """
        Parse the extracted text to find technical requirements following the template pattern
        """
        items = []
        
        # Patterns to match the template format
        patterns = {
            # Main pattern for Tech. Requ. No.
            'tech_req': r'Tech\.\s*Requ?\.\s*No\.\s*([0-9]+(?:\.[0-9]+)*(?:\.[0-9]+)?)',
            
            # Technical Requirement section
            'tech_requirement': r'Technical\s+Requirement:?\s*(.*?)(?=Bidder\'s\s+technical\s+reasons|$)',
            
            # Bidder's technical reasons
            'bidder_reasons': r'Bidder\'s\s+technical\s+reasons\s+supporting\s+compliance:?\s*(.*?)(?=Bidder\'s\s+cross\s+references|$)',
            
            # Cross references
            'cross_references': r'Bidder\'s\s+cross\s+references\s+to\s+supporting\s+information\s+in\s+Technical\s+Bid:?\s*(.*?)(?=Tech\.\s*Requ?\.\s*No\.|$)',
        }
        
        # Split text into potential requirement blocks
        # Look for Tech. Requ. No. patterns
        tech_req_splits = re.split(r'Tech\.\s*Requ?\.\s*No\.\s*([0-9]+(?:\.[0-9]+)*(?:\.[0-9]+)?)', text, flags=re.IGNORECASE | re.DOTALL)
        
        for i in range(1, len(tech_req_splits), 2):  # Skip the first empty split, then take every other pair
            if i + 1 < len(tech_req_splits):
                req_number = tech_req_splits[i].strip()
                req_content = tech_req_splits[i + 1].strip()
                
                # Extract the components from this requirement block
                item = self.extract_requirement_components(req_number, req_content, page_num)
                if item:
                    items.append(item)
        
        return items
    
    def extract_requirement_components(self, req_number: str, content: str, page_num: int = None) -> Dict:
        """
        Extract individual components from a requirement block
        """
        item = {
            'tech_req_no': req_number.strip(),
            'technical_requirement': '',
            'bidder_technical_reasons': '',
            'bidder_cross_references': '',
            'page_number': page_num
        }
        
        # Clean up the content
        content = re.sub(r'\s+', ' ', content).strip()
        
        # Extract Technical Requirement
        tech_req_match = re.search(r'Technical\s+Requirement:?\s*(.*?)(?=Bidder\'s\s+technical\s+reasons|Bidder\'s\s+cross\s+references|$)', 
                                 content, re.IGNORECASE | re.DOTALL)
        if tech_req_match:
            item['technical_requirement'] = tech_req_match.group(1).strip()
        
        # Extract Bidder's technical reasons
        reasons_match = re.search(r'Bidder\'s\s+technical\s+reasons\s+supporting\s+compliance:?\s*(.*?)(?=Bidder\'s\s+cross\s+references|$)', 
                                content, re.IGNORECASE | re.DOTALL)
        if reasons_match:
            item['bidder_technical_reasons'] = reasons_match.group(1).strip()
        
        # Extract Cross references
        cross_ref_match = re.search(r'Bidder\'s\s+cross\s+references\s+to\s+supporting\s+information\s+in\s+Technical\s+Bid:?\s*(.*?)$', 
                                  content, re.IGNORECASE | re.DOTALL)
        if cross_ref_match:
            item['bidder_cross_references'] = cross_ref_match.group(1).strip()
        
        # Only return item if we found at least the requirement number and some content
        if item['tech_req_no'] and (item['technical_requirement'] or item['bidder_technical_reasons'] or item['bidder_cross_references']):
            return item
        
        return None
    
    def clean_extracted_text(self, text: str) -> str:
        """
        Clean up extracted text by removing extra whitespace and fixing common issues
        """
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove page numbers and headers/footers
        text = re.sub(r'Page\s+\d+\s+of\s+\d+', '', text, flags=re.IGNORECASE)
        text = re.sub(r'^\d+$', '', text, flags=re.MULTILINE)
        
        # Fix common OCR issues
        text = text.replace('Bidde r\'s', 'Bidder\'s')
        text = text.replace('technica l', 'technical')
        text = text.replace('Technica l', 'Technical')
        
        return text.strip()
    
    def save_to_csv(self, items: List[Dict], output_file: str):
        """
        Save extracted items to CSV file
        """
        if not items:
            logger.warning("No items to save")
            return
        
        # Define CSV headers
        headers = [
            'Tech_Req_No',
            'Technical_Requirement', 
            'Bidder_Technical_Reasons',
            'Bidder_Cross_References',
            'Page_Number'
        ]
        
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=headers)
            writer.writeheader()
            
            for item in items:
                # Clean the text fields
                cleaned_item = {
                    'Tech_Req_No': item.get('tech_req_no', ''),
                    'Technical_Requirement': self.clean_extracted_text(item.get('technical_requirement', '')),
                    'Bidder_Technical_Reasons': self.clean_extracted_text(item.get('bidder_technical_reasons', '')),
                    'Bidder_Cross_References': self.clean_extracted_text(item.get('bidder_cross_references', '')),
                    'Page_Number': item.get('page_number', '')
                }
                writer.writerow(cleaned_item)
        
        logger.info(f"Saved {len(items)} items to {output_file}")
    
    def save_to_excel(self, items: List[Dict], output_file: str):
        """
        Save extracted items to Excel file with formatting
        """
        if not items:
            logger.warning("No items to save")
            return
        
        # Prepare data for DataFrame
        data = []
        for item in items:
            cleaned_item = {
                'Tech_Req_No': item.get('tech_req_no', ''),
                'Technical_Requirement': self.clean_extracted_text(item.get('technical_requirement', '')),
                'Bidder_Technical_Reasons': self.clean_extracted_text(item.get('bidder_technical_reasons', '')),
                'Bidder_Cross_References': self.clean_extracted_text(item.get('bidder_cross_references', '')),
                'Page_Number': item.get('page_number', '')
            }
            data.append(cleaned_item)
        
        # Create DataFrame and save to Excel
        df = pd.DataFrame(data)
        
        with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Technical_Requirements', index=False)
            
            # Auto-adjust column widths
            worksheet = writer.sheets['Technical_Requirements']
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 100)  # Cap at 100 characters
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        logger.info(f"Saved {len(items)} items to {output_file}")
    
    def extract_from_pdf(self, pdf_path: str) -> List[Dict]:
        """
        Main extraction method that tries multiple approaches
        """
        logger.info(f"Starting extraction from: {pdf_path}")
        
        # Try pdfplumber first (usually better for text extraction)
        items = self.extract_with_pdfplumber(pdf_path)
        
        # If no items found, try PyPDF2
        if not items:
            logger.info("No items found with pdfplumber, trying PyPDF2...")
            items = self.extract_with_pypdf2(pdf_path)
        
        logger.info(f"Extracted {len(items)} technical requirements")
        return items

def main():
    # PDF file path
    pdf_path = "pdf/26 TECHNICAL RESPONSIVENESS CHECKLIST.pdf"
    
    # Check if file exists
    if not Path(pdf_path).exists():
        logger.error(f"PDF file not found: {pdf_path}")
        return
    
    # Create extractor
    extractor = TechnicalRequirementsExtractor()
    
    # Extract requirements
    try:
        items = extractor.extract_from_pdf(pdf_path)
        
        if items:
            # Save to CSV
            csv_output = "technical_requirements.csv"
            extractor.save_to_csv(items, csv_output)
            
            # Save to Excel (if pandas is available)
            try:
                excel_output = "technical_requirements.xlsx"
                extractor.save_to_excel(items, excel_output)
            except ImportError:
                logger.warning("pandas not available, skipping Excel export")
            
            # Print summary
            print(f"\n✅ Extraction completed successfully!")
            print(f"📊 Total items extracted: {len(items)}")
            print(f"📄 CSV file: {csv_output}")
            print(f"📄 Excel file: {excel_output}")
            
            # Show first few items as preview
            print(f"\n📋 Preview of first 3 items:")
            for i, item in enumerate(items[:3], 1):
                print(f"\n{i}. Tech Req No: {item.get('tech_req_no', 'N/A')}")
                print(f"   Requirement: {item.get('technical_requirement', 'N/A')[:100]}...")
                print(f"   Reasons: {item.get('bidder_technical_reasons', 'N/A')[:100]}...")
        else:
            print("❌ No technical requirements found in the PDF")
            print("This might be due to:")
            print("  - PDF is image-based (scanned) and needs OCR")
            print("  - Different text structure than expected")
            print("  - PDF protection preventing text extraction")
            
    except Exception as e:
        logger.error(f"Error during extraction: {e}")
        print(f"❌ Extraction failed: {e}")

if __name__ == "__main__":
    main()
