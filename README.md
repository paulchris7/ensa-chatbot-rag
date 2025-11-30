# 🎓 ENSA-Bot : Assistant Intelligent RAG

![ENSA Logo](frontend/src/assets/ensa-logo.png)

> **Assistant virtuel intelligent dédié aux étudiants de l'ENSA Marrakech.**
> *Projet Académique - Génie Informatique (GI4)*

## Présentation

**ENSA-Bot** est une application Full-Stack utilisant l'Intelligence Artificielle générative pour répondre instantanément aux questions des étudiants.

Contrairement à un chatbot classique, il utilise une architecture **RAG (Retrieval-Augmented Generation)**. Cela signifie qu'il ne se contente pas de discuter : il consulte une base de connaissances vectorielle (contenant les règlements intérieurs, les descriptifs de filières, et la vie parascolaire de l'école) avant de formuler une réponse précise et sourcée.

## Fonctionnalités Clés

### Intelligence Artificielle
* **Architecture RAG :** Recherche sémantique dans les documents PDF de l'école via **Pinecone**.
* **Modèle Local (Privacy First) :** Utilise **Ollama** (modèle `gemma:2b`) pour tourner localement sans envoyer de données sensibles dans le cloud.
* **Contexte Intelligent :** Maintient le fil de la conversation.

### Interface Utilisateur (Front-End)
* **Design "Liquid Glass" :** Une interface moderne avec effets de transparence et flou (Glassmorphism).
* **Thèmes Dynamiques :** Support complet du Mode Sombre (Dark Mode) et Mode Clair.
* **Responsive Design :** Compatible PC, Tablette et Mobile avec Sidebar adaptative.
* **UX Soignée :** Animations fluides, formatage Markdown, suggestions rapides (Quick Prompts).

---

## Stack Technique

Ce projet est structuré en **Monorepo** :

| Composant | Technologies | Rôle |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, TailwindCSS, Lucide-React | Interface Utilisateur (SPA) |
| **Backend** | Python, Flask, Flask-CORS | Serveur API REST |
| **IA & Data** | LangChain, Ollama, Pinecone, HuggingFace | Orchestration RAG & LLM |

---

## Structure du Projet
ensa-chatbot-rag/
├── backend/                # API Flask & Logique IA
│   ├── data/               # Documents sources (PDF/TXT)
│   ├── src/                # Scripts auxiliaires (Prompts, Helpers)
│   ├── app.py              # Point d'entrée du serveur
│   └── store_index.py      # Script d'ingestion des données
│
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Sidebar, ChatArea, MessageBubble...
│   │   ├── contexts/       # Gestion du Thème
│   │   └── assets/         # Images et Logos
│   └── tailwind.config.js  # Configuration du Design System
│
└── README.md               # Documentation

## Auteurs
Projet réalisé par les étudiants de 4ème année (GI4) - ENSA Marrakech :
* [Paul Christopher Aimé] - Lead Front-End & Intégration
* [Safia Ait Hammoud] - Backend & RAG Engineering
* [Saad Eddine Ait Abd] - Data Collection & Testing

## Guide d'Installation

### Pré-requis
* [Node.js](https://nodejs.org/) (v16+)
* [Python](https://www.python.org/) (v3.10+)
* [Ollama](https://ollama.com/) installé et en cours d'exécution.

### 1. Configuration du Cerveau (Backend)

Ouvrez un terminal et naviguez vers le dossier backend :

```bash
cd backend
```

Installez les dépendances Python :
```bash
pip install -r requirements.txt
```

Téléchargez le modèle d'IA local (via Ollama) :
```bash
ollama pull gemma:2b
```

Configurez les clés API : Créez un fichier .env dans le dossier backend/ et ajoutez votre clé Pinecone :

```bash
PINECONE_API_KEY="votre-cle-api-pinecone-ici"
```

(Optionnel) Initialisez la base de connaissances : Si c'est la première fois, indexez les PDF de l'école dans Pinecone
```bash
python store_index.py
```

Lancez le serveur API :
```bash
python app.py
```

Le serveur démarrera sur http://localhost:5000.

### 2. Lancement de l'Interface (Frontend)

Ouvrez un nouveau terminal à la racine du projet :
```bash
cd frontend
```

Installez les librairies :
```bash
npm install
```

Lancez l'application en mode développement :
```bash
npm run dev
```

L'application sera accessible sur http://localhost:5173.
