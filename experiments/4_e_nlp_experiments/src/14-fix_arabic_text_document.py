# When Arabic text files are converted from pdf to txt, we might face problems concerning \n
# This code reformats text files by combining lines into the next (.) period ended line.


import re
import sys

# Define the input and output file names
INPUT_FILE_NAME = "../data/penal_law_text.txt"
OUTPUT_FILE_NAME = "../data/modified_penal_law_text.txt"

# Open the input text file for reading
with open(INPUT_FILE_NAME, 'r') as input_file:
    # Open the output text file for writing
    with open(OUTPUT_FILE_NAME, 'w') as output_file:
        # Initialize a variable to keep track of the previous line
        line_buffer = ""

        for line in input_file:
            if line.strip().endswith('.'):
                # If there is anythin in the buffer, add it to the current (.) ending line
                if len(line_buffer) > 0:
                    output_file.write(line_buffer + ' ' + line.strip() + "\n")  
                    line_buffer = ''    
                else:
                    output_file.write(line.strip() + "\n")                         
            else:
                # Join the current line with the previous line, separating them with a space
                line_buffer = line_buffer.strip() + ' ' + line.strip()
             

# Check if there's any remaining text in the previous line
if line_buffer:
    with open(OUTPUT_FILE_NAME, 'a') as output_file:
        output_file.write(line_buffer + '\n')

print("File corrected and saved as", OUTPUT_FILE_NAME)