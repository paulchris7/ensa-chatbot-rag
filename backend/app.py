# -*- coding: utf-8 -*-
"""
Flask backend for a RAG-based chatbot.

This module sets up and runs a Flask web server that exposes a single '/chat'
API endpoint. It initializes all necessary components for a Retrieval-Augmented
Generation (RAG) pipeline on startup, including language model embeddings,
a Pinecone vector store, and the final processing chain.
"""

# 1. Standard Library Imports
import os

# 2. Third-Party Library Imports
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_pinecone import PineconeVectorStore

# 3. Local Application Imports
from src.helper import download_hugging_face_embeddings
from src.prompt import SYSTEM_PROMPT

# --- Application Initialization ---

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# --- Environment & API Key Configuration ---

load_dotenv()
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in environment variables.")

# --- RAG Pipeline Configuration ---

# Load embeddings model
embeddings = download_hugging_face_embeddings()

# Connect to the existing Pinecone index
index_name = "ensa-chatbot"
docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)

# Configure the retriever
retriever = docsearch.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)

# Initialize the local LLM
chat_model = Ollama(model="gemma:2b")

# Create the prompt template
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        ("human", "{input}"),
    ]
)

# Build the RAG chain
question_answer_chain = create_stuff_documents_chain(chat_model, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

print("Server is ready and waiting for requests...")


# --- API Endpoint Definition ---

@app.route('/chat', methods=['POST'])
def chat():
    """
    Handles chat requests from the frontend.

    Receives a JSON payload with a 'query', processes it through the RAG
    pipeline, and returns the generated answer.

    Returns:
        A JSON response containing the answer or an error message.
    """
    try:
        data = request.json
        user_query = data.get('query')

        if not user_query:
            return jsonify({"error": "No query provided"}), 400

        print(f"Received query: {user_query}")

        # Process the query using the RAG chain
        response = rag_chain.invoke({"input": user_query})
        answer_text = response.get("answer", "No answer could be generated.")

        print("Sending response.")

        return jsonify({"answer": answer_text})

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({
            "answer": "An internal server error occurred."
        }), 500


# --- Server Execution ---

if __name__ == '__main__':
    # Binds to 0.0.0.0 to allow access from other devices on the network
    app.run(host='0.0.0.0', port=5000, debug=True)
