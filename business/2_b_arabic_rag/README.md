# Arabic Retrieval Augmented Generation (Arabic RAG)
## Questions Answering based on Documents - In Arabic
A project for creating a ChatBot that can answer questions based on a collection of documents.
This project was started in August 2023

The project idea is based on the github projects mainly the Llama-2-Open-Source-LLM-CPU-Inference project on github.

The Llama-2-Open-Source-LLM-CPU-Inference is forked from
https://github.com/kennethleungty/Llama-2-Open-Source-LLM-CPU-Inference

The chatdocs project was forked from https://github.com/marella/chatdocs
### Note on Llama2 QA
I created a launch setting with "cwd": "${workspaceFolder}/Llama-2-Open-Source-LLM-CPU-Inference" to make sure that the program is running correctly because the main.py of Llama-2-Open-Source-LLM-CPU-Inference is in a child folder!

### Note on ChatDocs
I tried to run the chatdocs project but I received a message related to non-existing document index, although an index was there. There was an issue opened by some user, maybe I can check it out later.
Notice that the chatdoc preperation process install some language models in me/.cashe/hub/some huggingface folder

### Note on Llama2 QA
The initial result of arabic QA on traffic law was very poor.
I used the same sentence_embedding model and the same Llama2 model

