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
import engine_supervised

BASE_URL = "https://api.shopbop.com"
CATEGORIES = ["pants", "shirts", "accessories", "shoes"]

base_headers = {
    "accept": "application/json",
    "Client-Id": "Shopbop-UW-Team1-2024",
    "Client-Version": "1.0.0"
}

def load_models():
    model = joblib.load("model_rf.pkl")
    scaler_x = joblib.load("scaler_X.pkl")
    scaler_y = joblib.load("scaler_y.pkl")
    le_dict = joblib.load("label_encoders.pkl")
    return model, scaler_x, scaler_y, le_dict

def get_candidates(query, limit=10, offset=0):
    url = f"{BASE_URL}/public/search"
    params = {
        "q": query,
        "limit": limit,
        "offset": offset,
        "lang": "en-US",
        "currency": "USD",
        "dept": "WOMENS",
        "allowOutOfStockItems": "false"
    }

    r = requests.get(url, headers=base_headers, params=params)
    return r.json().get("products", [])


def extract_product_features(product, category):
    try:
        img_path = product.get("colors", [])[0].get("images", [])[0].get("src", "")
        img_url = "https://www.shopbop.com" + img_path
    except:
        img_url = ""

    return {
        "product_id": product.get("productSin", ""),
        "brand": product.get("designerName", ""),
        "name": product.get("shortDescription", ""),
        "price": product.get("retailPrice", {}).get("usdPrice", ""),
        "category": category,
        "color": product.get("colors", [])[0].get("name", ""),
        "img_url": img_url,
        "url": product.get("productDetailUrl")
    }


if __name__ == "__main__":
    model, scaler_x, scaler_y, le_dict = load_models()
    candidates = []

    for x in CATEGORIES:
        products = get_candidates(x, limit=50, offset=0)
        for product_wrapper in products:
                product = product_wrapper.get("product", {})
                if not product:
                    continue
                sin = product.get("productSin", "")
                base_info = extract_product_features(product, x)
                candidates.append(base_info)

    print(candidates[0:10])

    liked_url = 'http://18.118.186.108:5000/swipebop/liked/ryanrumao'
    base_products = requests.get(liked_url).json().get("items", [])

    for i in base_products[0:5]:
        reccomendations = engine_supervised.recommend(i, candidates, model, scaler_x, scaler_y, le_dict, 4)
        print("\nBase Item:", i)
        print("\nRecommended Outfit Items:")
        for rec in reccomendations:
            print(f"- {rec['name']} by {rec['brand']} - ${rec['price']}")
        print("\n")
        print("=========================================")
        print("\n")