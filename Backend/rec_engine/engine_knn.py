import json
import numpy as np
import requests
from PIL import Image
from io import BytesIO
from tqdm import tqdm
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from torchvision import models, transforms
import torch
import joblib

# ====================== CONFIG ======================
IMAGE_SIZE = 224
NUM_RECOMMENDATIONS = 3
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ====================== LOAD MODEL ======================
image_model = models.resnet18(pretrained=True)
image_model.fc = torch.nn.Identity()
image_model = image_model.to(DEVICE).eval()

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# ====================== FEATURE EXTRACTION ======================
def extract_image_embedding(img_url):
    try:
        response = requests.get(img_url, timeout=5)
        img = Image.open(BytesIO(response.content)).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            embedding = image_model(tensor).cpu().numpy().flatten()
        return embedding
    except:
        return np.zeros(512)

def extract_structured_features(product):
    return np.array([
        product.get("price", 0),
        len(product.get("name", "")),
        len(product.get("brand", "")),
        hash(product.get("color", "")) % 1000  # Color encoding
    ])

def extract_feature_vector(product):
    structured = extract_structured_features(product)
    image_vector = extract_image_embedding(product["img_url"]) if product.get("img_url") else np.zeros(512)
    return np.concatenate([structured, image_vector])

# ====================== LOAD JSON DATA ======================
def load_json_dataset(path):
    with open(path, "r") as f:
        return json.load(f)

def flatten_outfit_items(dataset):
    items = []
    for base_item in dataset:
        for outfit in base_item.get("outfits", []):
            items.append(outfit)
    return items

# ====================== TRAINING ======================
def build_training_vectors(outfit_items):
    vectors = []
    for item in tqdm(outfit_items, desc="Building training vectors"):
        vec = extract_feature_vector(item)
        vectors.append(vec)
    return np.array(vectors)

def train_model(vectors):
    scaler = StandardScaler()
    scaled_vectors = scaler.fit_transform(vectors)
    model = NearestNeighbors(n_neighbors=NUM_RECOMMENDATIONS, algorithm="auto")
    model.fit(scaled_vectors)
    return model, scaler

# ====================== INFERENCE ======================
def recommend_outfits(base_product, candidate_items, model, scaler, top_k=3):
    if not candidate_items:
        return []

    base_vector = extract_feature_vector(base_product)
    base_vector_scaled = scaler.transform([base_vector])

    candidate_vectors = np.array([extract_feature_vector(p) for p in candidate_items])
    candidate_vectors_scaled = scaler.transform(candidate_vectors)

    k = min(top_k, len(candidate_items))
    model.fit(candidate_vectors_scaled)

    distances, indices = model.kneighbors(base_vector_scaled, n_neighbors=k)
    return [candidate_items[i] for i in indices[0]]

# ====================== MAIN ======================
if __name__ == "__main__":
    # 1. Load dataset
    dataset = load_json_dataset("nested_outfit_dataset_2.json")
    outfit_items = flatten_outfit_items(dataset)

    # 2. Train
    # outfit_vectors = build_training_vectors(outfit_items)
    # model, scaler = train_model(outfit_vectors)
    # joblib.dump(model, "model_knn.pkl")
    # joblib.dump(scaler, "scaler_knn.pkl")
    # 3. Recommend for a new item (can be from new or existing source)
    
    model = joblib.load("model_knn.pkl")
    scaler = joblib.load("scaler_knn.pkl")
    base_product = dataset[0]
    unseen_products = dataset[100:200]  # simulate new arrivals
    recommendations = recommend_outfits(base_product, unseen_products, model, scaler)

    print("\nBase Product:", base_product["name"])
    print("\nRecommended Outfit Items:")
    for r in recommendations:
        print(f"- {r['name']} by {r['brand']} - ${r['price']}")