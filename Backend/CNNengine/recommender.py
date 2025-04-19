import os
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from random import sample


EMBEDDINGS_DIR = "/home/ec2-user/SwipeBop/Backend/CNNengine/embeddings"
# EMBEDDINGS_DIR = "/Users/raihan/Desktop/classes/SwipeBop/Backend/CNNengine/embeddings"

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

# cosine similarity, problem is it will recommend same items everytime
# def recommend_products(user_emb, catalog_embeddings, exclude_ids=[], top_n=10):
#     scores = {}
#     for pid, emb in catalog_embeddings.items():
#         if pid in exclude_ids:
#             continue
#         sim = cosine_similarity([user_emb], [emb])[0][0]
#         scores[pid] = sim
#     return sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]

def hybrid_recommend(user_emb, catalog, exclude_ids, top_k=20, final_n=10, random_frac=0.3):
    # get the 20 most similar:
    top20 = sorted(
        ((pid, cosine_similarity([user_emb],[emb])[0][0]) for pid,emb in catalog.items()
         if pid not in exclude_ids),
        key=lambda x: x[1], reverse=True
    )[:top_k]
    top_pids = [pid for pid,_ in top20]
    # pick 70% from the very best, 30% at random from the rest:
    from math import floor
    best_n = floor(final_n * (1 - random_frac))
    recs = sample(top_pids[:best_n], best_n)
    # and  the rest from the lower‐ranked top20
    other = sample(top_pids[best_n:], final_n - best_n)
    return recs + other