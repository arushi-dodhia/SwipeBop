import json
import numpy as np
import requests
from PIL import Image
from io import BytesIO
from tqdm import tqdm
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
import torch
from torchvision import models, transforms
import joblib

# ================= CONFIG =================
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
IMAGE_SIZE = 224
NUM_RECOMMENDATIONS = 3

# ================= IMAGE MODEL =================
image_model = models.resnet18(weights="IMAGENET1K_V1")
image_model.fc = torch.nn.Identity()
image_model = image_model.to(DEVICE).eval()

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

def extract_image_embedding(img_url):
    try:
        response = requests.get(img_url, timeout=3)
        img = Image.open(BytesIO(response.content)).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            embedding = image_model(tensor).cpu().numpy().flatten()
        return embedding
    except:
        return np.zeros(512)

# ================= STRUCTURED FEATURES =================
def encode_text(text, le_dict, key):
    if key not in le_dict:
        le_dict[key] = LabelEncoder()
        le_dict[key].fit([text])
    le = le_dict[key]
    if text not in le.classes_:
        le.classes_ = np.append(le.classes_, text)
    return le.transform([text])[0]

def extract_structured_features(product, le_dict):
    return np.array([
        product.get("price", 0),
        encode_text(product.get("brand", ""), le_dict, "brand"),
        encode_text(product.get("name", ""), le_dict, "name"),
        encode_text(product.get("color", ""), le_dict, "color")
    ])

# ================= LOAD & BUILD DATA =================
def load_json(path):
    with open(path, "r") as f:
        return json.load(f)

def build_dataset(json_data):
    le_dict = {}
    X, y = [], []

    for item in tqdm(json_data, desc="Building training dataset"):
        base_vec = np.concatenate([
            extract_structured_features(item, le_dict),
            extract_image_embedding(item.get("img_url", ""))
        ])
        for outfit_item in item.get("outfits", []):
            outfit_vec = np.concatenate([
                extract_structured_features(outfit_item, le_dict),
                extract_image_embedding(outfit_item.get("img_url", ""))
            ])
            X.append(base_vec)
            y.append(outfit_vec)

    return np.array(X), np.array(y), le_dict

# ================= TRAIN MODEL =================
def train_model(X, y):
    scaler_X = StandardScaler()
    scaler_y = StandardScaler()
    X_scaled = scaler_X.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y)

    model = RandomForestRegressor(n_estimators=100)
    model.fit(X_scaled, y_scaled)

    return model, scaler_X, scaler_y

# ================= RECOMMENDATION =================
def recommend(base_product, candidates, model, scaler_X, scaler_y, le_dict, top_k=4):
    base_vec = np.concatenate([
        extract_structured_features(base_product, le_dict),
        extract_image_embedding(base_product.get("img_url", ""))
    ])
    base_scaled = scaler_X.transform([base_vec])
    pred_scaled = model.predict(base_scaled)[0]

    scores = []
    for cand in candidates:
        cand_vec = np.concatenate([
            extract_structured_features(cand, le_dict),
            extract_image_embedding(cand.get("img_url", ""))
        ])
        cand_scaled = scaler_y.transform([cand_vec])
        distance = np.linalg.norm(pred_scaled - cand_scaled)
        scores.append(distance)

    top_indices = np.argsort(scores)[:top_k]
    return [candidates[i] for i in top_indices]

# ================= MAIN =================
if __name__ == "__main__":
    data = load_json("nested_outfit_dataset.json")
    # x, y, le_dict = build_dataset(data)

    # model, scaler_x, scaler_y = train_model(x, y)

    # joblib.dump(model, "model_rf.pkl")
    # joblib.dump(scaler_x, "scaler_x.pkl")
    # joblib.dump(scaler_y, "scaler_y.pkl")
    # joblib.dump(le_dict, "label_encoders.pkl")

    model = joblib.load("model_rf.pkl")
    scaler_x = joblib.load("scaler_X.pkl")
    scaler_y = joblib.load("scaler_y.pkl")
    le_dict = joblib.load("label_encoder.pkl")
    base_item = data[0]
    candidates = [item for d in data[50:100] for item in d.get("outfits", [])]
    recommendations = recommend(base_item, candidates, model, scaler_x, scaler_y, le_dict)

    print("\nBase Item:", base_item["name"])
    print("\nRecommended Outfit Items:")
    for rec in recommendations:
        print(f"- {rec['name']} by {rec['brand']} - ${rec['price']}")