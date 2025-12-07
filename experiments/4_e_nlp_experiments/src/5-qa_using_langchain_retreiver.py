# https://python.langchain.com/docs/use_cases/question_answering/how_to/vector_db_qa

# An example at Langchain site, the main point is that this example uses compatible LLM and Embeddings
# this constrasts with the model I am trying to work with (Llama 2 Open Source LLM CPU...etc)

# I defined my OPENAI_API_KEY as environment variable via export command export OPENAI_API_KEY = -----

from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma

# loader = TextLoader("../data/data_en/state_of_the_union.txt")
loader = TextLoader("../data/data_ar/traffic law.txt")

documents = loader.load()

text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
docsearch = Chroma.from_documents(texts, embeddings)

qa = RetrievalQA.from_chain_type(llm=OpenAI(), chain_type="stuff", retriever=docsearch.as_retriever())

# query = "What did the president say about Ketanji Brown Jackson"
# query = "When can a law enforcement officer arrest a driver?"
query = "What is the punishment for any driver who drives his car using a fraudlent number plates?"
# query = "ما هي عقوبة قيادة مركبة بلوحات أرقام مزورة أو لوحات غير مشروعة"
print(len(query))


var = qa.run(query)

print(var)


# The answer below seems to be correct. The question was in english and the answer was returned in english
# and the embeddings were provided by OpenAI
# query = "What is the punishment for any driver who drives his car using a fraudlent number plates?"
# answer = "Using embedded DuckDB without persistence: data will be transient
# The punishment for any driver who drives his car using a fraudlent number plates is a jail sentence of no less than one month and no more than three months, or a fine of no less than 250 dinars and no more than 500 dinars, or both punishments. The penalty may be doubled if the offence is repeated within one year of the offence being committed."