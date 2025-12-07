# The objective of this code is get familiar with the automatix text splitting process
# My need is to split text into chunks with suitable sizes while also keep the split
# Peices of text semantically related.

# Langchain has a text spliter, SpaCy and NLTK has splitters, also I think LamaIndex has its splitter


import re
import sys
import tiktoken
import json

# Define the input and output file names
INPUT_FILE_NAME = "../data/penal_law_text.txt"
OUTPUT_FILE_NAME = "../data/chunked_penal_law_text.jsonl"

# Open the input text file for reading and read the file
with open(INPUT_FILE_NAME, 'r') as input_file:
    text_file = input_file.read()

    with open(OUTPUT_FILE_NAME, 'w', encoding="utf-8") as output_file:
        from langchain.text_splitter import CharacterTextSplitter
        text_splitter = CharacterTextSplitter(        
            separator = "\n",
            chunk_size = 500,
            chunk_overlap  = 100,
            length_function = len,
        )
        
        i = 1
        texts = text_splitter.create_documents([text_file])
        for t in texts:            
            data = f'{{"id":{i},"length":{len(t.page_content)},"text":"{t.page_content}"}}\n'
            output_file.write(data)
            i+=1
            

# Print some stats about the file content
print(f"Number of characters in file: {len(text_file)}")
print(f"Number of words in file: {len(text_file.split())}")  
# Your paragraph
paragraph = texts[0].page_content
# Get the number of characters (including spaces)
char_count = len(paragraph)
# Get the number of words
word_count = len(paragraph.split())
print(f"Number of characters in paragraph: {char_count}")
print(f"Number of words in paragraph: {word_count}")
encoding = tiktoken.encoding_for_model("text-davinci-003")
tokens = encoding.encode(paragraph)
print (f"number of tokens for the paragraph is :{len(tokens)}")
               
   