# This thoughts of this code is to compare embeddings for Arabic sentences
# The code uses sentence transformer library to encode text
# other option would be to use the direct LLM e.g. BERT approach where we extract the
# desired embedding layer, apparently SentenceTransformer is more equiped to this purpose

# Here are the results for the 3 listed sentences, apparently there is somethin wrong with the 2nd and 3rd sentences!
# Similarity between sentence 1 and sentence 2: 0.8055
# Similarity between sentence 1 and sentence 3: 0.7266
# Similarity between sentence 2 and sentence 3: 0.7739

from sentence_transformers import SentenceTransformer, util

# Load a pre-trained Arabic BERT-based model
model = SentenceTransformer('aubmindlab/bert-base-arabert')
# model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Define three Arabic sentences
sentence1 = "مرحبا يا سيدي العزيز"
sentence2 = "كيف حالك اليوم؟"
# sentence3 = "مساء الخير، هل يمكنني مساعدتك؟"
sentence3 = "البرتقال فواكة لذيذة"

# sentence1 = "How are you my dear friend?"
# sentence2 = "How are you doing today?"
# sentence3 = "Orange is a delicious fruit."

# Encode the sentences to get their embeddings
embeddings1 = model.encode(sentence1, convert_to_tensor=True)
embeddings2 = model.encode(sentence2, convert_to_tensor=True)
embeddings3 = model.encode(sentence3, convert_to_tensor=True)

# Calculate cosine similarities between sentence pairs
similarity_1_2 = util.pytorch_cos_sim(embeddings1, embeddings2)
similarity_1_3 = util.pytorch_cos_sim(embeddings1, embeddings3)
similarity_2_3 = util.pytorch_cos_sim(embeddings2, embeddings3)

# Print the cosine similarities
print(f"Similarity between sentence 1 and sentence 2: {similarity_1_2.item():.4f}")
print(f"Similarity between sentence 1 and sentence 3: {similarity_1_3.item():.4f}")
print(f"Similarity between sentence 2 and sentence 3: {similarity_2_3.item():.4f}")
