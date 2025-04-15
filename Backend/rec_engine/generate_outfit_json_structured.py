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

def fetch_outfits(product_sin):
    url = f"{BASE_URL}/public/products/{product_sin}/outfits"
    r = requests.get(url, headers=base_headers, params={"lang": "en-US"})
    if r.status_code != 200:
        return []

    data = r.json()
    outfits = []

    for styleColor in data.get("styleColorOutfits", []):
        for outfit in styleColor.get("outfits", []):
            for item in outfit.get("styleColors", []):
                product = item.get("product", {})
                if not product:
                    continue

                try:
                    img_path = product.get("colors", [])[0].get("images", [])[0].get("src", "")
                    img_url = "https://www.shopbop.com" + img_path
                except:
                    img_url = ""

                outfit_item = {
                    "product_id": product.get("productSin", ""),
                    "brand": product.get("designerName", ""),
                    "name": product.get("shortDescription", ""),
                    "price": product.get("retailPrice", {}).get("usdPrice", ""),
                    "category": product.get("productCategory", "N/A"),
                    "img_url": img_url
                }

                outfits.append(outfit_item)
                if len(outfits) == MAX_OUTFITS:
                    return outfits
    return outfits

def main():
    data = []

    for category in CATEGORIES:
        print(f"Fetching products in category: {category}")
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
                base_info = extract_product_features(product)
                outfit_items = fetch_outfits(sin)
                if outfit_items:
                    entry = base_info
                    entry["outfits"] = outfit_items
                    data.append(entry)
                    valid_count += 1

    with open("nested_outfit_dataset.json", "w") as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    main()
