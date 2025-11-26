# ENSA-bot
Chatbot intelligent pour répondre aux FAQ des étudiants de l’ENSA Marrakech, utilisant un LLM local (Ollama), LangChain et Pinecone

Le système utilise un modèle LLM local via Ollama (phi3), un pipeline LangChain, et Pinecone pour la recherche vectorielle des documents.

## Fonctionnalités

Répond aux FAQ des étudiants ENSA Marrakech

Basé sur un modèle LLM local (Ollama phi3)

Recherche intelligente dans les documents administratifs

Intégration LangChain + Pinecone pour un RAG performant

Interface simple et rapide

## Tech Stack

Python

LangChain

Flask 

Ollama (phi3)

Pinecone (Vector Store)

PDF (Source de données)

## Installation & Exécution
 1. Cloner le projet
git clone <url-du-projet>

 2. Créer l’environnement conda
conda create -n botENSA python=3.10 -y
conda activate botENSA

 3. Installer les dépendances
pip install -r requirements.txt

 4. Installer le modèle LLM local (phi3)
Assurez-vous d’avoir Ollama installé sur votre machine. Le modèle sera téléchargé et utilisable localement.
ollama pull phi3

 5. Configurer la clé Pinecone

Créer un fichier .env à la racine :

PINECONE_API_KEY="xxxxxxxxxxxxxxxxxxxx"

 6. Générer les embeddings et remplir l’index Pinecone
python store_index.py

7. Lancer l’application
python app.py
