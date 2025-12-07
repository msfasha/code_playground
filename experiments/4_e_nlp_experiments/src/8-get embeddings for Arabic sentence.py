# In this code we create embeddings for a sentence using two methods, using transformers and using SentenceTransformer
# The finding is that each method produces a different embedding, althought they might be using the same LLM
# This can be related to the internal processing of each model!

import torch
from transformers import BertTokenizer, BertModel
from sentence_transformers import SentenceTransformer

# Method 1: Using Hugging Face Transformers
model_name = 'aubmindlab/bert-base-arabert'
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertModel.from_pretrained(model_name)

input_text = "مرحبا يا سيدي العزيز"
tokens = tokenizer(input_text, return_tensors='pt', padding=True, truncation=True)

with torch.no_grad():
    outputs = model(**tokens)

# researchers and practitioners use the embedding of the [CLS] token, extracted from a pre-trained transformer-based model like BERT, as a summary or representation of the entire input text.
# Here's why it's common to use the [CLS] token's embedding:
# Sentence Classification: In tasks like text classification (e.g., sentiment analysis, topic classification), you often need to make predictions about the entire input text. The [CLS] token's embedding is used as a fixed-length representation of the input sentence, which can then be fed into a classifier to make predictions.
# Sentence Pair Tasks: In tasks that involve comparing or analyzing two sentences (e.g., natural language inference, paraphrase detection), practitioners use both the [CLS] token's embedding from the first sentence and the [CLS] token's embedding from the second sentence as inputs to a downstream model.
# Similarity Tasks: When you need to compute sentence or text similarity, the [CLS] token's embedding can serve as a dense representation of the sentence, making it easier to calculate similarity metrics like cosine similarity or Euclidean distance between two sentences.

embeddings_hf = outputs.last_hidden_state[:, 0, :] # Extract the embeddings for the CLS token!

# Method 2: Using Sentence Transformers
model_st = SentenceTransformer('aubmindlab/bert-base-arabert')
input_text = "مرحبا يا سيدي العزيز"
embeddings_st = model_st.encode(input_text, convert_to_tensor=True)

# Check if the embeddings are similar
cosine_similarity = torch.nn.functional.cosine_similarity(embeddings_hf, embeddings_st)
cosine_similarity_value = cosine_similarity.item()  # Convert the tensor to a Python float
print(embeddings_hf.shape)
print(embeddings_st.shape)
print(f"Cosine Similarity between embeddings: {cosine_similarity_value}")
