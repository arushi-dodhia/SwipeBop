import requests
from cnn_recommender import build_catalog_embeddings, build_user_embedding, recommend_products

api_url = "http://18.118.186.108:5000/swipebop/search_filtered?limit=100"
response = requests.get(api_url)
products_json = response.json()

catalog_embeddings = build_catalog_embeddings(products_json)

liked_product_sins = ["1589379074", "1526257577", "1515411284"]

user_embedding = build_user_embedding(liked_product_sins, catalog_embeddings)

if user_embedding is None:
    print("Error: Could not create user embedding. Check liked products.")
    exit()

recommendations = recommend_products(user_embedding, catalog_embeddings, exclude_ids=liked_product_sins, top_n=5)

print("\nTop Recommendations:")
for pid, score in recommendations:
    print(f"ProductSin: {pid} - Similarity Score: {score:.4f}")