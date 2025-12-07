# This file worked on the penal law

# This code is used to generate QA pairs using ChatGPT
# This version includes a function to make sure that the chunk size does not exceed a specific value
# I used this specific version to generate the dataset

# The code is used to iterate Jordanian traffic law document and split it into chunks
# Afterwards, each chunk is used to generate a number of questions and answers 3 to N number of questions
# The QAs are dumped into a json file
# Examining the cost of the generation process demonstrated that the cost might be significant

# Version 2 - The prompt asks ChatGPT to generate 1 QA pair while the n paramter in the request is 
# set to some x value e.g. 5 so ask to generate or rerun the prompt n times

import openai
import json
import os
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter


# Initialization Settings
input_file = "/home/me/mywork/nlp/nlp_experiments/data/penal_law_text.txt"
output_file = "/home/me/mywork/nlp/nlp_experiments/data/penal_law_qa_pairs.txt"
max_tokens = 3000
chunk_size = 500
chunk_overlap = 10

# Chose API Key
openai.api_key = os.environ["OPENAI_API_MOHD_FASHA_KEY"]
# openai.api_key = os.environ["OPENAI_API_FASHA_INBOX_KEY"]

# Make sure not to exceed specified chunk size
def split_text(text, chunk_size, chunk_overlap):
    text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    doc_chunks = text_splitter.split_documents(text)
    text_chunks = []

    for doc_chunk in doc_chunks:
        # If the chunk is within the desired size limit, add it directly
        if len(doc_chunk.page_content) <= chunk_size:
            text_chunks.append(doc_chunk.page_content)
        else:
            # If the chunk is larger than the limit, split it into smaller chunks
            sub_chunks = [doc_chunk.page_content[i:i+chunk_size] for i in range(0, len(doc_chunk.page_content), chunk_size)]
            text_chunks.extend(sub_chunks)    

    return text_chunks

def generate_qa_pairs_from_pdf(text_chunks,start_chunk_number=1, max_tokens=max_tokens):

    for text_chunk in text_chunks:
        context = text_chunk.replace('\r', '').replace('\n', '')

        print(f"Operating chunk number {start_chunk_number} of {len(text_chunks)}, chunk size is: {len(context)}\n")

        custom_prompt=f"""Create a single short question and answer pair in Arabic language based on the context below,
        #### CONTEXT: {context} ####"""

        try:
            # Generate a question-answer pair using ChatGPT
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=custom_prompt,
                max_tokens=max_tokens,
                n=3,
                stop=None,
                temperature=.2
            )

            # Access the "choices" list in the JSON response object and extract the text
            response_list = [choice["text"].strip().split('\n') for choice in response.choices]

            # Initialize an empty list to store dictionaries
            qa_pairs = []

            # Initialize variables to hold the current question and answer
            current_question = ""
            current_answer = ""

            for item in response_list:
                item = [i for i in item if i != ""]  # remove empty lines
                current_question = item[0]
                current_answer = item[1]
                qa_pairs.append({"question": current_question, "answer": current_answer})

            parent_dict = {"id": start_chunk_number, "context": context, "qa_pairs": qa_pairs}

            # Save results to a disk file
            with open(output_file, "a", encoding="utf-8") as json_file:
                # Use json.dump() to write the dictionary to the file
                json.dump(parent_dict, json_file, ensure_ascii=False, indent=4)
        except Exception as e:
            # Handle exceptions here
            print(f"An error occurred at chunk {start_chunk_number}", str(e))
        
        start_chunk_number += 1

    return 0

###############################################################
# The code starts here
###############################################################


# Load the document
loader = TextLoader(input_file)
documents = loader.load()

# Split document text into Chunks
text_chunks = split_text(documents, chunk_size, chunk_overlap)

# Specify the file path where you want to save the list
file_path = "../data/penal_law_chunked.txt"

# Open the file in write mode and write each string from the list as a line
with open(file_path, "w") as file:
    i = 0
    for item in text_chunks:        
        str = f"Chunk id: {i}, length:{len(item)}\n"
        file.write(str)

        file.write("%s\n\n\n" % item)
        i += 1


# Generate QAs using OpenAI LLM
# response_list = generate_qa_pairs_from_pdf(text_chunks, start_chunk_number = 1)
