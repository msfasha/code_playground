#!/usr/bin/env python3
"""
Simple JSON to CSV Converter for NG-911 Requirements
"""

import json
import csv


def convert_requirements_to_csv():
    """
    Convert the requirements JSON file to CSV format
    """
    input_file = "requirements"
    output_file = "requirements.csv"
    
    try:
        # Read JSON file
        with open(input_file, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        
        # Write CSV file
        with open(output_file, 'w', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            
            # Write header row
            writer.writerow(['Requirement Number', 'Description'])
            
            # Process each requirement
            for index, requirement in enumerate(data, 1):
                if isinstance(requirement, dict):
                    # Get requirement number or generate one
                    req_num = requirement.get('requirement_number', f'REQ-{index:03d}')
                    
                    # Clean description - remove extra whitespace and newlines
                    description = requirement.get('description', '')
                    description = ' '.join(description.split())
                    
                    # Write row
                    writer.writerow([req_num, description])
        
        print(f"✅ Successfully converted {input_file} to {output_file}")
        print(f"📊 Processed {len(data)} requirements")
        
    except FileNotFoundError:
        print(f"❌ Error: File '{input_file}' not found")
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON format: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    convert_requirements_to_csv()
