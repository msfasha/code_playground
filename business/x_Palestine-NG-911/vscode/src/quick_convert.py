#!/usr/bin/env python3
"""
One-liner JSON to CSV converter
"""
import json, csv
with open('requirements', 'r') as f: data = json.load(f)
with open('requirements_oneliner.csv', 'w', newline='') as f: 
    writer = csv.writer(f); writer.writerow(['Requirement Number', 'Description'])
    [writer.writerow([req.get('requirement_number', f'REQ-{i:03d}'), ' '.join(req.get('description', '').split())]) for i, req in enumerate(data, 1) if isinstance(req, dict)]
print("✅ Quick conversion complete: requirements_oneliner.csv")
