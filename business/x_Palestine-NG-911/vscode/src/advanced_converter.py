#!/usr/bin/env python3
"""
Advanced JSON to CSV Converter for NG-911 Requirements
Includes features like filtering, categorization, and export options
"""

import json
import csv
import pandas as pd
from datetime import datetime
import argparse
import os


class RequirementsConverter:
    def __init__(self, input_file="requirements"):
        self.input_file = input_file
        self.data = None
        self.load_data()
    
    def load_data(self):
        """Load JSON data from file"""
        try:
            with open(self.input_file, 'r', encoding='utf-8') as file:
                self.data = json.load(file)
            print(f"✅ Loaded {len(self.data)} requirements from {self.input_file}")
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            self.data = []
    
    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ""
        # Remove extra whitespace and newlines
        cleaned = ' '.join(text.split())
        # Remove special characters that might break CSV
        cleaned = cleaned.replace('"', '""')  # Escape quotes
        return cleaned
    
    def categorize_requirement(self, req_num, description):
        """Categorize requirements based on content"""
        description_lower = description.lower()
        req_num_parts = req_num.split('.')
        
        # Basic categorization based on requirement number pattern
        if len(req_num_parts) >= 3:
            if req_num_parts[2] == '1':
                return "Core System Functions"
            elif req_num_parts[2] == '2':
                return "VoIP/PBX Functions"
            elif req_num_parts[2] == '3':
                return "User Interface & Operations"
            elif req_num_parts[2] == '4':
                return "Call Distribution & Routing"
            elif req_num_parts[2] == '5':
                return "Voice Documentation & Recording"
        
        # Content-based categorization
        if any(word in description_lower for word in ['emergency', 'incident', 'call']):
            return "Emergency Call Handling"
        elif any(word in description_lower for word in ['interface', 'ui', 'display', 'client']):
            return "User Interface"
        elif any(word in description_lower for word in ['conference', 'transfer', 'hold']):
            return "Call Management"
        elif any(word in description_lower for word in ['voip', 'sip', 'pbx', 'trunk']):
            return "VoIP/Telephony"
        elif any(word in description_lower for word in ['recording', 'documentation', 'voice']):
            return "Voice Recording"
        elif any(word in description_lower for word in ['gis', 'geographical', 'location']):
            return "Geographic Information"
        else:
            return "General"
    
    def get_priority(self, description):
        """Assign priority based on content"""
        description_lower = description.lower()
        
        if any(word in description_lower for word in ['must', 'shall', 'emergency']):
            return "High"
        elif any(word in description_lower for word in ['should', 'recommended']):
            return "Medium"
        else:
            return "Low"
    
    def convert_to_csv(self, output_file="requirements.csv", include_metadata=True):
        """Convert to basic CSV format"""
        try:
            with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
                if include_metadata:
                    fieldnames = ['Requirement Number', 'Category', 'Priority', 'Description', 'Word Count']
                else:
                    fieldnames = ['Requirement Number', 'Description']
                
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                
                for index, requirement in enumerate(self.data, 1):
                    if isinstance(requirement, dict):
                        req_num = requirement.get('requirement_number', f'REQ-{index:03d}')
                        description = self.clean_text(requirement.get('description', ''))
                        
                        row = {
                            'Requirement Number': req_num,
                            'Description': description
                        }
                        
                        if include_metadata:
                            row.update({
                                'Category': self.categorize_requirement(req_num, description),
                                'Priority': self.get_priority(description),
                                'Word Count': len(description.split())
                            })
                        
                        writer.writerow(row)
            
            print(f"✅ Successfully created {output_file}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating CSV: {e}")
            return False
    
    def convert_to_excel(self, output_file="requirements.xlsx"):
        """Convert to Excel format with multiple sheets"""
        try:
            # Prepare data
            data_list = []
            categories = {}
            
            for index, requirement in enumerate(self.data, 1):
                if isinstance(requirement, dict):
                    req_num = requirement.get('requirement_number', f'REQ-{index:03d}')
                    description = self.clean_text(requirement.get('description', ''))
                    category = self.categorize_requirement(req_num, description)
                    priority = self.get_priority(description)
                    word_count = len(description.split())
                    
                    row = {
                        'Requirement Number': req_num,
                        'Category': category,
                        'Priority': priority,
                        'Description': description,
                        'Word Count': word_count
                    }
                    
                    data_list.append(row)
                    
                    # Group by category
                    if category not in categories:
                        categories[category] = []
                    categories[category].append(row)
            
            # Create Excel file with multiple sheets
            with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
                # Main sheet with all requirements
                df_main = pd.DataFrame(data_list)
                df_main.to_excel(writer, sheet_name='All Requirements', index=False)
                
                # Category sheets
                for category, requirements in categories.items():
                    if requirements:
                        df_category = pd.DataFrame(requirements)
                        # Clean sheet name for Excel compatibility
                        sheet_name = category.replace('/', '_')[:31]  # Excel sheet name limit
                        df_category.to_excel(writer, sheet_name=sheet_name, index=False)
                
                # Summary sheet
                summary_data = {
                    'Category': list(categories.keys()),
                    'Count': [len(requirements) for requirements in categories.values()]
                }
                df_summary = pd.DataFrame(summary_data)
                df_summary.to_excel(writer, sheet_name='Summary', index=False)
            
            print(f"✅ Successfully created {output_file} with {len(categories)} category sheets")
            return True
            
        except Exception as e:
            print(f"❌ Error creating Excel file: {e}")
            print("Note: Install pandas and openpyxl for Excel support: pip install pandas openpyxl")
            return False
    
    def generate_report(self):
        """Generate a summary report"""
        if not self.data:
            print("No data available for report")
            return
        
        total_requirements = len(self.data)
        categories = {}
        priorities = {"High": 0, "Medium": 0, "Low": 0}
        word_counts = []
        
        for index, requirement in enumerate(self.data, 1):
            if isinstance(requirement, dict):
                req_num = requirement.get('requirement_number', f'REQ-{index:03d}')
                description = self.clean_text(requirement.get('description', ''))
                category = self.categorize_requirement(req_num, description)
                priority = self.get_priority(description)
                word_count = len(description.split())
                
                categories[category] = categories.get(category, 0) + 1
                priorities[priority] += 1
                word_counts.append(word_count)
        
        print("\n" + "="*50)
        print("📊 REQUIREMENTS ANALYSIS REPORT")
        print("="*50)
        print(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Total Requirements: {total_requirements}")
        print(f"Average Description Length: {sum(word_counts)/len(word_counts):.1f} words")
        
        print("\n📋 Categories:")
        for category, count in sorted(categories.items()):
            percentage = (count / total_requirements) * 100
            print(f"  • {category}: {count} ({percentage:.1f}%)")
        
        print("\n⚡ Priorities:")
        for priority, count in priorities.items():
            percentage = (count / total_requirements) * 100
            print(f"  • {priority}: {count} ({percentage:.1f}%)")
        
        print("="*50)


def main():
    parser = argparse.ArgumentParser(description='Convert NG-911 requirements to various formats')
    parser.add_argument('--input', default='requirements', help='Input JSON file')
    parser.add_argument('--format', choices=['csv', 'excel', 'both'], default='csv', help='Output format')
    parser.add_argument('--simple', action='store_true', help='Simple CSV without metadata')
    parser.add_argument('--report', action='store_true', help='Generate analysis report')
    
    args = parser.parse_args()
    
    converter = RequirementsConverter(args.input)
    
    if args.report:
        converter.generate_report()
    
    if args.format in ['csv', 'both']:
        converter.convert_to_csv(include_metadata=not args.simple)
    
    if args.format in ['excel', 'both']:
        converter.convert_to_excel()


if __name__ == "__main__":
    # If run without arguments, provide a simple interface
    if len(os.sys.argv) == 1:
        converter = RequirementsConverter()
        print("\n🔧 NG-911 Requirements Converter")
        print("Choose an option:")
        print("1. Simple CSV")
        print("2. Enhanced CSV with metadata")
        print("3. Excel with multiple sheets")
        print("4. Analysis report")
        print("5. All formats")
        
        choice = input("\nEnter choice (1-5): ").strip()
        
        if choice == "1":
            converter.convert_to_csv(include_metadata=False)
        elif choice == "2":
            converter.convert_to_csv(include_metadata=True)
        elif choice == "3":
            converter.convert_to_excel()
        elif choice == "4":
            converter.generate_report()
        elif choice == "5":
            converter.convert_to_csv(include_metadata=True)
            converter.convert_to_excel()
            converter.generate_report()
        else:
            print("Invalid choice. Running simple CSV conversion...")
            converter.convert_to_csv(include_metadata=False)
    else:
        main()
