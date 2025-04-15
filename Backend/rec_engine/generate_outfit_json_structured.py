import json
import requests

BASE_URL = "https://api.shopbop.com"
CATEGORIES = ["pants", "shirts", "dresses", "jackets"]
MAX_OUTFITS = 4
LIMIT_PER_CATEGORY = 250 // len(CATEGORIES)

base_headers = {
    "accept": "application/json",
    "Client-Id": "Shopbop-UW-Team1-2024",
    "Client-Version": "1.0.0"
}

def search_products(query, limit=40, offset=0):
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

def extract_product_features(product):
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
        "category": product.get("productCategory", "N/A"),
        "img_url": img_url
    }

def main():
    all_data = {}

    for category in CATEGORIES:
        print(f"Fetching for category: {category}")
        items = []
        valid_count = 0
        offset = 0
        while valid_count < LIMIT_PER_CATEGORY:
            products = search_products(category, limit=40, offset=offset)
            offset += 40
            for product_wrapper in products:
                if valid_count >= LIMIT_PER_CATEGORY:
                    break
                product = product_wrapper.get("product", {})
                if not product:
                    continue
                sin = product.get("productSin", "")
                features = extract_product_features(product)
                features["base_product_sin"] = sin
                items.append(features)
                valid_count += 1
        all_data[category] = items

    with open("structured_outfit_dataset.json", "w") as f:
        json.dump(all_data, f, indent=2)

if __name__ == "__main__":
    main()
