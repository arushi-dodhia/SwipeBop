import os
import requests
from PIL import Image
from io import BytesIO
import random
import time

# IMAGES_DIR = "/home/ec2-user/SwipeBop/Backend/CNNengine/images"
IMAGES_DIR = "/Users/raihan/Desktop/classes/SwipeBop/Backend/CNNengine/images"
API_URL = "http://18.118.186.108:5000/swipebop/search_filtered"

def fetch_and_save_image(product_sin, image_url):
    try:
        img_path = os.path.join(IMAGES_DIR, f"{product_sin}.jpg")
        if os.path.exists(img_path):
            return
        response = requests.get(image_url, timeout=10)
        img = Image.open(BytesIO(response.content)).convert('RGB')
        img = img.resize((224, 224))
        img.save(img_path, "JPEG", quality=85)
        print(f"Saved {product_sin}")
    except Exception as e:
        print(f"Failed {product_sin}: {e}")

def download_images_batch():
    if not os.path.exists(IMAGES_DIR):
        os.makedirs(IMAGES_DIR)

    random_offset = random.randint(0, 500)
    params = {
        "q": "shirts",
        "limit": 50,
        "offset": random_offset
    }
    try:
        response = requests.get(API_URL, params=params, timeout=20)
        if response.status_code == 200:
            products_json = response.json()
            for product in products_json['products']:
                product_sin = product.get("productSin")
                image_url = product.get("imageURL")
                if product_sin and image_url:
                    fetch_and_save_image(product_sin, image_url)
        else:
            print(f"Error fetching products: {response.status_code}")
    except Exception as e:
        print(f"Failed batch download: {e}")

if __name__ == "__main__":
    while True:
        download_images_batch()
        time.sleep(3600)  # every hour