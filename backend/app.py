from flask import Flask, request, jsonify
from flask_cors import CORS
from src.helper import download_hugging_face_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from langchain_community.llms import Ollama
from src.prompt import *
import os

# --- 1. CONFIGURATION INITIALE (Se lance une seule fois au démarrage) ---
app = Flask(__name__)
CORS(app) # Autorise ton Frontend React à parler à ce serveur

load_dotenv()

# Vérification de la clé API
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
if not PINECONE_API_KEY:
    print("Erreur : PINECONE_API_KEY non trouvée dans le fichier .env")
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

print("Chargement des Embeddings HuggingFace...")
embeddings = download_hugging_face_embeddings()

index_name = "ensa-chatbot" 

# Connexion à Pinecone
print("Connexion à l'index Pinecone...")
docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)

retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k":3})

# Initialisation du LLM Local (gemma:2b)
print("Initialisation du modèle Ollama (gemma:2b)...")
chatModel = Ollama(model="gemma:2b")

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(chatModel, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

print("✅ Serveur prêt ! En attente de requêtes...")


# --- 2. DÉFINITION DE LA ROUTE API (Ce que ton React appelle) ---
@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Récupérer la question envoyée par le React
        data = request.json
        user_query = data.get('query')
        
        if not user_query:
            return jsonify({"error": "Aucune question fournie"}), 400

        print(f"📩 Question reçue : {user_query}")

        # Lancer la chaîne RAG (Recherche + Génération)
        response = rag_chain.invoke({"input": user_query})
        
        # Récupérer la réponse texte
        answer_text = response["answer"]
        
        # (Optionnel) Récupérer les sources utilisées pour répondre
        # sources = [doc.metadata.get('source', 'Inconnu') for doc in response.get("context", [])]

        print("📤 Réponse envoyée.")
        
        # Renvoyer le JSON au React
        return jsonify({
            "answer": answer_text,
            # "sources": sources # Tu pourras décommenter ça plus tard si tu veux afficher les sources
        })

    except Exception as e:
        print(f"❌ Erreur : {e}")
        return jsonify({"answer": "Désolé, une erreur technique est survenue sur le serveur."}), 500


# --- 3. LANCEMENT DU SERVEUR ---
if __name__ == '__main__':
    # host='0.0.0.0' permet l'accès depuis d'autres appareils (mobile) sur le même wifi
    app.run(host='0.0.0.0', port=5000, debug=True)