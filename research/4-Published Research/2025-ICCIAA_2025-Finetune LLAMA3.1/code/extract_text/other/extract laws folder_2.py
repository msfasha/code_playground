# This code extracts all the arabic text from html files, not just the one inside article tag
# I noticed it also extracted english text

import os
import re
from bs4 import BeautifulSoup
from tqdm import tqdm  # Import tqdm for the progress bar

# Arabic Unicode character range
ARABIC_PATTERN = re.compile(r'[\u0600-\u06FF]+')

# Function to check if the text contains Arabic
def contains_arabic(text):
    return bool(ARABIC_PATTERN.search(text))

# Function to extract Arabic text from HTML and directly write it to a file
def extract_and_save_arabic_text_from_html(file_path, output_file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'lxml')  # Parse HTML
        arabic_text = []

        # Extract text from all HTML tags
        for tag in soup.find_all(string=True):
            if contains_arabic(tag):
                arabic_text.append(tag.strip())
    
    # If we found Arabic text, write it to a separate file
    if arabic_text:
        with open(output_file_path, 'w', encoding='utf-8') as f:
            for text in arabic_text:
                f.write(f"{text}\n")
        print(f"Saved: {output_file_path}")
    else:
        print(f"No Arabic content found in: {file_path}")

# Function to create a valid filename based on the original file path
def create_output_filename(root_folder, file_path, output_folder):
    # Get relative path to preserve folder structure in output
    relative_path = os.path.relpath(file_path, root_folder)
    # Replace slashes with underscores for filenames
    output_filename = relative_path.replace(os.path.sep, '_') + '.txt'
    return os.path.join(output_folder, output_filename)

# Function to iterate through all folders and find HTML files with Arabic content
def process_html_files(root_folder, output_folder):
    # Walk through all files and folders
    html_files = []
    for dirpath, _, filenames in os.walk(root_folder):
        for file in filenames:
            if file.endswith(('.htm', '.html')):
                html_files.append(os.path.join(dirpath, file))

    # Use tqdm to show progress and process each file directly
    for file_path in tqdm(html_files, desc="Processing files"):
        output_file_path = create_output_filename(root_folder, file_path, output_folder)
        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)  # Create subfolders if needed
        extract_and_save_arabic_text_from_html(file_path, output_file_path)

# Main script execution
if __name__ == "__main__":
    root_folder = "E:\DATASETS\Jordan Law Dataset for LLM Fine Tunning"  # Replace with your folder path
    output_folder = root_folder + '/arabic_texts_output'  # Replace with your output folder
    os.makedirs(output_folder, exist_ok=True)  # Ensure the output folder exists

    # Process each HTML file and write the extracted Arabic text to separate files
    process_html_files(root_folder, output_folder)

    print("Arabic text extraction complete. Separate files saved.")







