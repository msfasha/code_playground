# Version 1 - The prompt asks ChatGPT to generate N Number of QA pairs while the 
# n parameter in the request is set to 1

# This code is used to generate QA pairs using ChatGPT
# The code is used to iterate Jordanian traffic law document and split it into chunks
# Afterwards, each chunk is used to generate a number of questions and answers 5 or 10
# The QAs are dumped into a json file
# Examining the cost of the generation process demonstrated that the cost might be significant

import openai
import os
import json

from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter

# We can change OpenAI key using the two statements below
# OPENAI_API_MOHD_FASHA_KEY has accesst to Free ChatGPT only while
# OPENAI_API_FASHA_INBOX_KEY has access to ChatGPT Plus
openai.api_key = os.environ["OPENAI_API_MOHD_FASHA_KEY"]
# openai.api_key = os.environ["OPENAI_API_FASHA_INBOX_KEY"]


def generate_qa_pairs_from_pdf(text_chunks, number_of_questions=3, max_tokens=3000):
    response_list = []

    i = 0
    for chunk in text_chunks:
        i += 1
        print(f"Operating chunk number {i} of {len(text_chunks)}\n")

        context = chunk.page_content.replace('\r', '').replace('\n', '')

        custom_prompt=f"""Create a list of {number_of_questions} Arabic question and answer pairs based on the context below, 
        #### CONTEXT: {context} ####"""

        # Generate a question-answer pair using ChatGPT
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=custom_prompt,
            max_tokens=max_tokens,
            n=1,
            stop=None,
            temperature=0.2
            )

        response_list = response.choices[0].text.strip().split('\n') 

        # Remove all the empty strings from the list
        response_list = [item for item in response_list if item != ""]

        # Initialize an empty list to store dictionaries
        qa_pairs = []

        # Initialize variables to hold the current question and answer
        current_question = ""
        current_answer = ""

        for item in response_list:
            if item.startswith('Q'):
                # If the item starts with 'Q', it's a question
                current_question = item[3:]  # Extract the question text (excluding 'Qx: ')
            elif item.startswith('A'):
                # If the item starts with 'A', it's an answer
                current_answer = item[3:]  # Extract the answer text (excluding 'Ax: ')
                # Create a dictionary for the Q&A pair and add it to the list
                qa_pairs.append({"question": current_question, "answer": current_answer})


        parent_dict = {"id":i, "context":context, "qa_pairs": qa_pairs}
        
        # Save results to disk file
        file_path = "/home/me/mywork/nlp/nlp_experiments/data/tobeignored/qa.txt"
        
        with open(file_path, "a", encoding="utf-8") as json_file:
            # Use json.dump() to write the dictionary to the file
            json.dump(parent_dict, json_file, ensure_ascii=False, indent=4)   

    return 0

loader = TextLoader("/home/me/mywork/nlp/nlp_experiments/data/tobeignored/traffic_law.txt")
documents = loader.load()

text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
chunks = text_splitter.split_documents(documents)

# Initialize OpenAI API client
openai.api_key = os.environ["OPENAI_API_KEY"]

# Lets try the first chunk only
response_list = generate_qa_pairs_from_pdf(chunks)




