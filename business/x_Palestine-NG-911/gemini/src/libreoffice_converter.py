#!/usr/bin/env python3
"""
LibreOffice-compatible CSV generator
Strips all Unicode characters and creates a clean ASCII-only CSV
"""

import json
import csv
import unicodedata

def strip_unicode_to_ascii(text):
    """
    Convert Unicode text to ASCII, removing or replacing problematic characters.
    This is the most aggressive approach for maximum LibreOffice compatibility.
    """
    if not text:
        return ""
    
    # First try to normalize Unicode characters to their closest ASCII equivalents
    text = unicodedata.normalize('NFKD', text)
    
    # Remove accents and diacritics
    ascii_text = ""
    for char in text:
        if ord(char) < 128:  # ASCII character
            ascii_text += char
        else:
            # Replace common Unicode characters with ASCII equivalents
            replacements = {
                '"': '"', '"': '"',  # Smart quotes
                ''': "'", ''': "'",  # Smart single quotes
                '–': '-', '—': '--', # Dashes
                '•': '*',            # Bullet
                '°': 'deg',          # Degree
                '→': '->',           # Arrow
                '■': '[*]',          # Square
                '…': '...',          # Ellipsis
                '®': '(R)',          # Registered
                '©': '(C)',          # Copyright
                '™': '(TM)',         # Trademark
                '€': 'EUR',          # Euro
                '£': 'GBP',          # Pound
                '¥': 'JPY',          # Yen
                'ä': 'a', 'ö': 'o', 'ü': 'u',  # German umlauts
                'é': 'e', 'è': 'e', 'ê': 'e',  # French accents
                'ñ': 'n',            # Spanish n
            }
            
            if char in replacements:
                ascii_text += replacements[char]
            else:
                # Skip unknown Unicode characters or replace with ?
                ascii_text += '?'
    
    return ascii_text

def create_libreoffice_csv():
    """Create a LibreOffice-compatible CSV file"""
    
    print("Creating LibreOffice-compatible CSV...")
    
    # Read the original requirements file
    with open('requirements', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create ultra-clean CSV
    output_file = "requirements_libreoffice.csv"
    
    with open(output_file, 'w', newline='', encoding='ascii', errors='replace') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        
        # Write header
        writer.writerow(['Requirement_Number', 'Description'])
        
        for index, item in enumerate(data, 1):
            if isinstance(item, dict):
                # Get requirement number
                req_num = item.get('requirement_number', f'REQ-{index:03d}')
                req_num = strip_unicode_to_ascii(req_num)
                
                # Get and clean description
                desc = item.get('description', '')
                desc = strip_unicode_to_ascii(desc)
                
                # Remove newlines and extra whitespace
                desc = ' '.join(desc.split())
                
                # Write row
                writer.writerow([req_num, desc])
    
    print(f"✓ LibreOffice-compatible file created: {output_file}")
    print("✓ All Unicode characters converted to ASCII")
    print("✓ Uses minimal quoting for better compatibility")
    
    # Show file info
    with open(output_file, 'r', encoding='ascii') as f:
        lines = f.readlines()
        print(f"✓ File contains {len(lines)-1} requirements")
    
    return output_file

if __name__ == "__main__":
    create_libreoffice_csv()
    
    print("\n📋 LibreOffice Import Instructions:")
    print("1. Open LibreOffice Calc")
    print("2. File → Open → requirements_libreoffice.csv")
    print("3. In the Text Import dialog:")
    print("   - Character set: ASCII/UTF-8")
    print("   - Separated by: Comma")
    print("   - Text delimiter: \" (double quote)")
    print("4. Click OK")
    print("\nThis file should display correctly without any strange characters!")
