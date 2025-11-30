# -*- coding: utf-8 -*-
"""
Builds and populates the Pinecone vector store.

This script is responsible for the one-time setup of the vector index. It
performs the following steps:
1. Loads PDF documents from a specified data directory.
2. Processes and splits the document text into manageable chunks.
3. Downloads the embedding model from HuggingFace.
4. Connects to Pinecone and creates a new serverless index if it
   doesn't exist.
5. Generates embeddings for the text chunks and upserts them into the
   Pinecone index.
"""

# 1. Standard Library Imports
import os

# 2. Third-Party Library Imports
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

# 3. Local Application Imports
from src.helper import (
    download_hugging_face_embeddings,
    load_pdf_file,
    text_split,
    filter_to_minimal_docs
)

load_dotenv()


def main():
    """
    Orchestrates the data loading, processing, and indexing pipeline.
    """
    # --- 1. API Key Configuration ---
    pinecone_api_key = os.environ.get("PINECONE_API_KEY")
    if not pinecone_api_key:
        raise ValueError("PINECONE_API_KEY not found in environment variables.")

    # --- 2. Data Loading and Preparation ---
    print("Loading PDF data from 'data/' directory...")
    extracted_data = load_pdf_file(data='data/')
    
    print("Filtering and processing documents...")
    filtered_data = filter_to_minimal_docs(extracted_data)
    
    print(f"Splitting {len(filtered_data)} documents into text chunks...")
    text_chunks = text_split(filtered_data)
    print(f"Created {len(text_chunks)} text chunks.")

    # --- 3. Embedding Model ---
    print("Downloading HuggingFace embeddings model...")
    embeddings = download_hugging_face_embeddings()

    # --- 4. Pinecone Index Setup ---
    print("Connecting to Pinecone...")
    pinecone_client = Pinecone(api_key=pinecone_api_key)

    index_name = "ensa-chatbot"

    print(f"Checking if index '{index_name}' exists...")
    if index_name not in pinecone_client.list_indexes().names():
        print(f"Index '{index_name}' not found. Creating new index...")
        pinecone_client.create_index(
            name=index_name,
            dimension=384,  # Dimension of the sentence-transformers/all-MiniLM-L6-v2 model
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
        print("Index created successfully.")
    else:
        print("Index already exists.")

    # --- 5. Vector Embedding and Storage ---
    print("Embedding documents and uploading to Pinecone index...")
    # This command creates embeddings and upserts them to the index.
    PineconeVectorStore.from_documents(
        documents=text_chunks,
        index_name=index_name,
        embedding=embeddings,
    )

    print("Indexing complete. The vector store is ready.")


if __name__ == "__main__":
    main()