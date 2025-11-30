# -*- coding: utf-8 -*-
"""
Data processing helper functions for the RAG pipeline.

This module provides utility functions for handling the initial data preparation
stages, including loading documents, splitting text, and initializing the
embedding model.
"""

# 1. Standard Library Imports
from typing import List

# 2. Third-Party Library Imports
from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter


def load_pdf_file(data: str) -> List[Document]:
    """
    Loads all PDF files from a specified directory.

    Args:
        data (str): The path to the directory containing PDF files.

    Returns:
        List[Document]: A list of Document objects, one for each page.
    """
    loader = DirectoryLoader(
        data,
        glob="*.pdf",
        loader_cls=PyPDFLoader
    )
    documents = loader.load()
    return documents


def filter_to_minimal_docs(docs: List[Document]) -> List[Document]:
    """
    Filters a list of Documents to a minimal set of metadata.

    Creates a new list of Document objects containing only the 'source'
    in their metadata, preserving the original page content.

    Args:
        docs (List[Document]): The list of documents to filter.

    Returns:
        List[Document]: A new list of cleaned Document objects.
    """
    minimal_docs: List[Document] = []
    for doc in docs:
        source = doc.metadata.get("source")
        minimal_docs.append(
            Document(
                page_content=doc.page_content,
                metadata={"source": source}
            )
        )
    return minimal_docs


def text_split(extracted_data: List[Document]) -> List[Document]:
    """
    Splits a list of documents into smaller text chunks.

    Args:
        extracted_data (List[Document]): The documents to be split.

    Returns:
        List[Document]: A list of new, smaller Document chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20
    )
    text_chunks = text_splitter.split_documents(extracted_data)
    return text_chunks


def download_hugging_face_embeddings() -> HuggingFaceEmbeddings:
    """
    Initializes and returns the HuggingFace embeddings model.

    This function specifies the sentence-transformer model to be used for
    creating vector embeddings.

    Returns:
        HuggingFaceEmbeddings: The configured embeddings model object.
        The 'sentence-transformers/all-MiniLM-L6-v2' model produces
        vectors with 384 dimensions.
    """
    embeddings = HuggingFaceEmbeddings(
        model_name='sentence-transformers/all-MiniLM-L6-v2'
    )
    return embeddings
