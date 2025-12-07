#!/usr/bin/env python3
"""
Script to fix Unicode smart quotes in JSON files and convert them to ASCII quotes.
This fixes rendering issues in applications like LibreOffice.
"""

import json
import re

def fix_unicode_quotes(text):
    """
    Replace Unicode smart quotes and other problematic characters with ASCII equivalents.
    
    Unicode characters that cause issues in LibreOffice:
    - " (U+201C) - Left double quotation mark
    - " (U+201D) - Right double quotation mark
    - ' (U+2018) - Left single quotation mark
    - ' (U+2019) - Right single quotation mark
    - … (U+2026) - Horizontal ellipsis
    - – (U+2013) - En dash
    - — (U+2014) - Em dash
    - • (U+2022) - Bullet point
    - ° (U+00B0) - Degree symbol
    - → (U+2192) - Rightward arrow
    - ■ (U+25A0) - Black square
    - ♦ (U+2666) - Black diamond
    - ® (U+00AE) - Registered sign
    - © (U+00A9) - Copyright sign
    - ™ (U+2122) - Trade mark sign
    """
    # Replace smart quotes with regular quotes
    text = text.replace('"', '"')  # Left double quote
    text = text.replace('"', '"')  # Right double quote
    text = text.replace(''', "'")  # Left single quote
    text = text.replace(''', "'")  # Right single quote
    
    # Replace other problematic Unicode characters
    text = text.replace('…', '...')  # Ellipsis
    text = text.replace('–', '-')    # En dash
    text = text.replace('—', '--')   # Em dash
    text = text.replace('•', '*')    # Bullet point
    text = text.replace('°', 'deg')  # Degree symbol
    text = text.replace('→', '->')   # Rightward arrow
    text = text.replace('■', '[*]')  # Black square
    text = text.replace('♦', '<>')   # Black diamond
    text = text.replace('®', '(R)')  # Registered sign
    text = text.replace('©', '(C)')  # Copyright sign
    text = text.replace('™', '(TM)') # Trade mark sign
    
    # Additional characters that might cause issues
    text = text.replace('´', "'")    # Acute accent
    text = text.replace('`', "'")    # Grave accent
    text = text.replace('‚', ',')    # Single low-9 quotation mark
    text = text.replace('„', '"')    # Double low-9 quotation mark
    text = text.replace('‹', '<')    # Single left angle quotation mark
    text = text.replace('›', '>')    # Single right angle quotation mark
    text = text.replace('«', '<<')   # Left double angle quotation mark
    text = text.replace('»', '>>')   # Right double angle quotation mark
    
    return text

def fix_requirements_file(input_file, output_file=None):
    """
    Fix Unicode quotes in requirements JSON file.
    """
    if output_file is None:
        output_file = input_file.replace('.json', '_fixed.json') if input_file.endswith('.json') else input_file + '_fixed'
    
    print(f"Reading file: {input_file}")
    
    # Read the file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Original content contains these Unicode characters:")
    unicode_chars = set()
    for char in content:
        if ord(char) > 127:  # Non-ASCII characters
            unicode_chars.add(f"'{char}' (U+{ord(char):04X})")
    
    for char in sorted(unicode_chars):
        print(f"  {char}")
    
    # Fix the quotes
    fixed_content = fix_unicode_quotes(content)
    
    # Write the fixed file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"\nFixed file saved as: {output_file}")
    
    # Verify it's valid JSON
    try:
        with open(output_file, 'r', encoding='utf-8') as f:
            json.load(f)
        print("✓ Fixed file is valid JSON")
    except json.JSONDecodeError as e:
        print(f"⚠ Warning: Fixed file may have JSON syntax issues: {e}")
    
    return output_file

if __name__ == "__main__":
    input_file = "requirements"
    output_file = fix_requirements_file(input_file)
    
    # Also create a clean CSV version with different encoding options
    print("\nCreating CSV versions with different approaches...")
    
    import csv
    
    try:
        with open(output_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Create standard CSV
        csv_file = "requirements_fixed.csv"
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Requirement Number', 'Description'])
            
            for item in data:
                req_num = item.get('requirement_number', 'N/A')
                desc = item.get('description', '')
                # Clean up newlines in description
                desc = desc.replace('\n', ' ').strip()
                writer.writerow([req_num, desc])
        
        print(f"✓ UTF-8 CSV file created: {csv_file}")
        
        # Create ASCII-compatible CSV (this should work better in LibreOffice)
        csv_file_ascii = "requirements_ascii.csv"
        with open(csv_file_ascii, 'w', newline='', encoding='ascii', errors='replace') as f:
            writer = csv.writer(f)
            writer.writerow(['Requirement Number', 'Description'])
            
            for item in data:
                req_num = item.get('requirement_number', 'N/A')
                desc = item.get('description', '')
                # Clean up newlines in description
                desc = desc.replace('\n', ' ').strip()
                # Force ASCII encoding - replace any non-ASCII chars with ?
                writer.writerow([req_num, desc])
        
        print(f"✓ ASCII CSV file created: {csv_file_ascii}")
        
        # Create Latin-1 encoded CSV (Windows-compatible)
        csv_file_latin1 = "requirements_latin1.csv"
        with open(csv_file_latin1, 'w', newline='', encoding='latin-1', errors='replace') as f:
            writer = csv.writer(f)
            writer.writerow(['Requirement Number', 'Description'])
            
            for item in data:
                req_num = item.get('requirement_number', 'N/A')
                desc = item.get('description', '')
                # Clean up newlines in description
                desc = desc.replace('\n', ' ').strip()
                writer.writerow([req_num, desc])
        
        print(f"✓ Latin-1 CSV file created: {csv_file_latin1}")
        
        print("\n📝 Try opening these files in LibreOffice:")
        print("  1. requirements_ascii.csv (safest for compatibility)")
        print("  2. requirements_latin1.csv (Windows compatible)")
        print("  3. requirements_fixed.csv (UTF-8 with fixed quotes)")
        
    except Exception as e:
        print(f"⚠ Could not create CSV: {e}")
