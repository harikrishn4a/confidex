import os
import re
from pypdf import PdfReader
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()

#read pdf 
PDF_PATH = "mockdata.pdf"
pdf_reader = PdfReader(PDF_PATH)

raw_text = ""
for page in pdf_reader.pages:
    page_text = page.extract_text()
    raw_text += page_text

#clean text
def clean_extracted_text(text: str) -> str:
    cleaned = re.sub(r'\s+', ' ', text)
    cleaned = re.sub(r'[\x00-\x1F\x7F]', '', cleaned)
    return cleaned.strip()

document_text = clean_extracted_text(raw_text)

#split text into chunks
chunk_size = 1000
chunk_overlap = 200

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=chunk_size,
    chunk_overlap=chunk_overlap,
    length_function=len,
    separators=["\n\n", "\n", ". ", " ", ""]
)
text_chunks = text_splitter.split_text(document_text)

#embedding
embedding_model = OllamaEmbeddings(model="llama3.1")

documents = []
for i, chunk in enumerate(text_chunks):
    doc = Document(
        page_content=chunk,
        metadata={
            "chunk_id": i,
            "chunk_length": len(chunk),
            "source": "pdf_document"
        }
    )
    documents.append(doc)

#vector store
vector_store = FAISS.from_documents(
    documents=documents,
    embedding=embedding_model
)

#retriever
retriever = vector_store.as_retriever(search_kwargs={"k": 4})

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

#llm model 
llm = OllamaLLM(
    model="llama3.1",
    temperature=0.0
)

system_prompt = """
You are an AI assistant that explains why certain information is sensitive or confidential. 
Use the context from the document to answer questions about data sensitivity. 
Rules:
1. Only use information from the provided context to answer questions.
2. If the context doesn't contain enough information, explain the sensitivity logically.
3. Focus on explaining why the data flagged as sensitive could be critical, personal, confidential, or risky if exposed.
4. Be clear, specific, and concise.
Context:
{context}
Question: {input}
Answer based on the context above:
"""
prompt_template = ChatPromptTemplate.from_template(system_prompt)


rag_chain = (
    {
        "context": retriever | format_docs,
        "input": RunnablePassthrough()
    }
    | prompt_template
    | llm
    | StrOutputParser()
)

#query function 
def ask_document_question(question: str):
    response = rag_chain.invoke(question)
    return response

if __name__ == "__main__":
    print("PDF RAG system loaded. Ask your question about sensitive data!")
    while True:
        user_question = input("\nEnter your question (or type 'exit' to quit): ")
        if user_question.strip().lower() == "exit":
            print("Exiting. Goodbye!")
            break
        answer = ask_document_question(user_question)
        print("\nAnswer:", answer)

