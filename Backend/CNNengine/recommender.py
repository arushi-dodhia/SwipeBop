import os
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# EMBEDDINGS_DIR = "/home/ec2-user/SwipeBop/Backend/CNNengine/embeddings"
EMBEDDINGS_DIR = "/Users/raihan/Desktop/classes/SwipeBop/Backend/CNNengine/embeddings"

def load_all_embeddings():
    catalog = {}
    for filename in os.listdir(EMBEDDINGS_DIR):
        if filename.endswith(".npy"):
            product_sin = filename.split(".")[0]
            emb = np.load(os.path.join(EMBEDDINGS_DIR, filename))
            catalog[product_sin] = emb
    return catalog

def build_user_embedding(liked_product_sins, catalog_embeddings):
    liked_embs = [catalog_embeddings[pid] for pid in liked_product_sins if pid in catalog_embeddings]
    if not liked_embs:
        return None
    return np.mean(liked_embs, axis=0)

def recommend_products(user_emb, catalog_embeddings, exclude_ids=[], top_n=10):
    scores = {}
    for pid, emb in catalog_embeddings.items():
        if pid in exclude_ids:
            continue
        sim = cosine_similarity([user_emb], [emb])[0][0]
        scores[pid] = sim
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]