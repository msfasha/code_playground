# https://python.langchain.com/docs/modules/data_connection/vectorstores/
# The same example as the previous one, but without LLM, the similarity search is performed directly
# by the db ie. chroma - this example uses OpenAI embeddings

from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma

# Load the document, split it into chunks, embed each chunk and load it into the vector store.
# raw_documents = TextLoader('../data/data_en/state_of_the_union.txt').load()
raw_documents = TextLoader("../data/data_ar/traffic law.txt").load()

text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
documents = text_splitter.split_documents(raw_documents)
db = Chroma.from_documents(documents, OpenAIEmbeddings())

# query = "What did the president say about Ketanji Brown Jackson"
query = "What is the punishment for any driver who drives his car using a fraudlent number plates?"

docs = db.similarity_search(query)
print(docs[0].page_content)

