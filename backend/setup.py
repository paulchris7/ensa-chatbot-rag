# -*- coding: utf-8 -*-
"""
Package definition for the ENSA Chatbot backend.

This file defines the package metadata and dependencies for the project,
allowing it to be installed as a standard Python package.
"""
from setuptools import find_packages, setup

# List of dependencies extracted from requirements.txt
install_requires = [
    "langchain==0.3.26",
    "flask==3.1.1",
    "sentence-transformers==4.1.0",
    "pypdf==5.6.1",
    "python-dotenv==1.1.0",
    "langchain-pinecone==0.2.8",
    "langchain-openai==0.3.24",
    "langchain-community==0.3.26",
    # flask-cors and pinecone-client are also used but not in requirements.txt
    "flask-cors",
    "pinecone-client"
]

setup(
    name="botENSA",
    version="0.1.0",
    author="safia",
    author_email="aithammouds@gmail.com",
    packages=find_packages(),
    install_requires=install_requires
)