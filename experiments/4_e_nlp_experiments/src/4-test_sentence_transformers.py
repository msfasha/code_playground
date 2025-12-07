from sentence_transformers import SentenceTransformer
# sentences = ["This is an example sentence", "Each sentence is converted"]
sentences = ["سبق الحصان الولد في الركض"]

# models that support Arabic
# arabic-bert-base and arabic-camembert


model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
embeddings = model.encode(sentences)
print(embeddings.shape)
