import faiss
import numpy as np
import pickle
import os
from sentence_transformers import SentenceTransformer

# Load model locally
model = SentenceTransformer('all-MiniLM-L6-v2')
dimension = 384
index_file = "faiss_index.bin"
id_map_file = "id_map.pkl"

def get_embedding(text):
    return model.encode([text])[0]

class VectorStore:
    def __init__(self):
        self.index = faiss.IndexFlatL2(dimension)
        self.id_map = {} # Maps FAISS index id to MySQL Candidate ID
        
        if os.path.exists(index_file):
            self.index = faiss.read_index(index_file)
        
        if os.path.exists(id_map_file):
            with open(id_map_file, "rb") as f:
                self.id_map = pickle.load(f)

    def add_candidate(self, text, candidate_id):
        embedding = get_embedding(text)
        faiss.normalize_L2(embedding.reshape(1, -1)) # Normalize for cosine similarity (optional but good practice)
        self.index.add(np.array([embedding], dtype=np.float32))
        
        # Determine internal FAISS ID (it's sequential)
        faiss_id = self.index.ntotal - 1
        self.id_map[faiss_id] = candidate_id
        
        self.save()

    def search(self, query_text, k=5):
        query_embedding = get_embedding(query_text)
        # faiss.normalize_L2(query_embedding.reshape(1, -1)) # If index vectors are normalized
        D, I = self.index.search(np.array([query_embedding], dtype=np.float32), k)
        
        results = []
        for i, idx in enumerate(I[0]):
            if idx != -1 and idx in self.id_map:
                results.append({
                    "candidate_id": self.id_map[idx],
                    "score": float(D[0][i]) # L2 distance, lower is better. For cosine need inner product index.
                })
        return results

    def save(self):
        faiss.write_index(self.index, index_file)
        with open(id_map_file, "wb") as f:
            pickle.dump(self.id_map, f)

vector_store = VectorStore()
