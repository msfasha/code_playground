#!/usr/bin/env python3
"""
JSON to CSV Converter for NG-911 Requirements
Converts the requirements JSON file to CSV format
"""

import json
import csv
import argparse
import os
from typing import List, Dict, Any


def clean_description(description: str) -> str:
    """
    Clean the description text by removing excessive whitespace and newlines
    """
    # Replace multiple whitespace and newlines with single space
    cleaned = ' '.join(description.split())
    return cleaned


def convert_json_to_csv(json_file_path: str, csv_file_path: str) -> None:
    """
    Convert JSON requirements file to CSV format
    
    Args:
        json_file_path (str): Path to the input JSON file
        csv_file_path (str): Path to the output CSV file
    """
    try:
        # Read JSON file
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        
        # Validate that data is a list
        if not isinstance(data, list):
            raise ValueError("JSON file must contain a list of requirements")
        
        # Prepare CSV headers
        headers = ['requirement_number', 'description']
        
        # Write CSV file
        with open(csv_file_path, 'w', newline='', encoding='utf-8') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=headers)
            
            # Write header row
            writer.writeheader()
            
            # Process each requirement
            for index, requirement in enumerate(data, 1):
                if isinstance(requirement, dict):
                    # Handle requirements with requirement_number
                    if 'requirement_number' in requirement and 'description' in requirement:
                        writer.writerow({
                            'requirement_number': requirement['requirement_number'],
                            'description': clean_description(requirement['description'])
                        })
                    # Handle requirements with only description (missing requirement_number)
                    elif 'description' in requirement:
                        writer.writerow({
                            'requirement_number': f'REQ-{index:03d}',  # Generate a requirement number
                            'description': clean_description(requirement['description'])
                        })
                    else:
                        print(f"Warning: Skipping invalid requirement at index {index}: {requirement}")
                else:
                    print(f"Warning: Skipping non-dict item at index {index}: {requirement}")
        
        print(f"Successfully converted {json_file_path} to {csv_file_path}")
        
    except FileNotFoundError:
        print(f"Error: File '{json_file_path}' not found")
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format in '{json_file_path}': {e}")
    except Exception as e:
        print(f"Error: {e}")


def main():
    """
    Main function to handle command line arguments and execute conversion
    """
    parser = argparse.ArgumentParser(
        description='Convert NG-911 requirements JSON file to CSV format'
    )
    parser.add_argument(
        'input_file', 
        help='Path to the input JSON file'
    )
    parser.add_argument(
        '-o', '--output', 
        help='Path to the output CSV file (default: input_file.csv)',
        default=None
    )
    
    args = parser.parse_args()
    
    # Determine output file path
    if args.output:
        output_file = args.output
    else:
        # Create output filename by replacing extension with .csv
        base_name = os.path.splitext(args.input_file)[0]
        output_file = f"{base_name}.csv"
    
    # Perform conversion
    convert_json_to_csv(args.input_file, output_file)


if __name__ == "__main__":
    main()
