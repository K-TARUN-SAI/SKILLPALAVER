# SkillParveer - AI Candidate Screening System

SkillParveer is an AI-powered candidate screening and recruitment system designed to streamline the hiring process. It leverages Large Language Models (LLMs) to analyze resumes, match candidates to job descriptions, generate screening quizzes, and rank applicants based on their suitability.

## Tech Stack Overview

### Backend
-   **Framework:** FastAPI
-   **Database:** MySQL (via SQLAlchemy)
-   **AI/ML:**
    -   **LLMs:** Groq (Llama 3), Ollama (Local Models)
    -   **Embeddings:** SentenceTransformers (all-MiniLM-L6-v2)
    -   **Vector Search:** FAISS
-   **Other Libraries:** Pydantic, Uvicorn, Python-multipart

### Frontend
-   **Framework:** React (Vite)
-   **Styling:** CSS (Modular/Standard)
-   **HTTP Client:** Axios
-   **Routing:** React Router DOM

## Prerequisites

Before running the project, ensure you have the following installed:
-   **Python 3.10+**
-   **Node.js & npm**
-   **MySQL Server**
-   **Ollama** (for local LLM capabilities, if configured)

## Obtaining API Keys

### Groq API Key
1.  Visit the [Groq Cloud Console](https://console.groq.com/keys).
2.  Log in or Sign up.
3.  Click on **"Create API Key"**.
4.  Copy the generated key (starts with `gsk_`).
5.  Paste it into your `backend/.env` file as `GROQ_API_KEY`.

## Installation & Setup

### 1. Database Setup
Make sure your MySQL server is running and create a database named `candidate_screening_db`.
```sql
CREATE DATABASE candidate_screening_db;
```

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Configure Environment Variables:
-   Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    # Windows
    copy .env.example .env
    ```
-   Open `.env` and update the `DATABASE_URL` with your MySQL credentials.
-   Add your `GROQ_API_KEY`.
-   Ensure `OLLAMA_BASE_URL` is correct if using Ollama.

Run the Backend Server:
```bash
python main.py
```
The backend API will be available at `http://localhost:8000`. API Docs are at `http://localhost:8000/docs`.

### 3. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the Development Server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Usage
1.  **Recruiters:** Post jobs, view applicants, and see AI-ranked candidates.
2.  **Candidates:** Apply for jobs, upload resumes, and take screening quizzes.
