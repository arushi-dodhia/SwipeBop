import requests
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from io import BytesIO
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Pretrained CNN (for now, we can build our own layer stack later)
resnet = models.resnet50(pretrained=True)
resnet = torch.nn.Sequential(*list(resnet.children())[:-1])
resnet.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def fetch_image(image_url):
    response = requests.get(image_url, timeout=30)
    img = Image.open(BytesIO(response.content)).convert('RGB')
    return img

def extract_embedding(img):
    img_tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        embedding = resnet(img_tensor).squeeze().numpy()
    return embedding

def build_catalog_embeddings(products_json):
    catalog = {}
    for product in products_json['products']:
        try:
            pid = product['productSin']
            img_url = product['imageURL']
            if img_url:
                img = fetch_image(img_url)
                emb = extract_embedding(img)
                catalog[pid] = emb
        except Exception as e:
            print(f"Error processing product {pid}: {e}")
            continue
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
