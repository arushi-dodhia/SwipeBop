import requests
import csv

# import sys
# import os
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))) 

# from app import base_headers

base_headers = {
    "accept": "application/json",
    "Client-Id": "Shopbop-UW-Team1-2024",
    "Client-Version": "1.0.0"
}


BASE_URL = "https://api.shopbop.com"
CATEGORIES = ["pants", "shirts", "dresses", "jackets"]
LIMIT_PER_CATEGORY = 250 // len(CATEGORIES)
MAX_OUTFITS = 4

def search_products(query, limit, offset=0):
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
    return r.json().get('products', [])


def fetch_outfits(product_sin):
    url = f"{BASE_URL}/public/products/{product_sin}/outfits"
    r = requests.get(url, headers=base_headers, params={"lang": "en-US"})
    if r.status_code != 200:
        print(f"Failed for {product_sin}: status {r.status_code}")
        return []

    data = r.json()
    outfits = []

    for styleColor in data.get("styleColorOutfits", []):
        for outfit in styleColor.get("outfits", []):
            for item in outfit.get("styleColors", []):
                product = item.get("product", {})
                url_path = product.get("productDetailUrl")
                if url_path:
                    full_url = "https://www.shopbop.com" + url_path
                    if full_url not in outfits:
                        outfits.append(full_url)
                        if len(outfits) == MAX_OUTFITS:
                            return outfits

    if not outfits:
        print(f"⚠️ No outfits for {product_sin}")
    return outfits



def main():
    all_rows = []
    for category in CATEGORIES:
        print(f"🔍 Fetching items for category: {category}")
        offset = 0
        valid_count = 0
        while valid_count < LIMIT_PER_CATEGORY:
            print(f"  → offset {offset}")
            products = search_products(category, 40)  # fetch 40 products at a time
            for product in products:
                if valid_count >= LIMIT_PER_CATEGORY:
                    break
                sin = product["product"]["productSin"]
                outfits = fetch_outfits(sin)
                if outfits:
                    row = [sin] + outfits + [""] * (MAX_OUTFITS - len(outfits))
                    all_rows.append(row)
                    valid_count += 1
                    print(f"Added SIN {sin} with {len(outfits)} outfits")
            offset += 40

    with open("outfits_dataset.csv", "w", newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["base_product_sin", "outfit_1", "outfit_2", "outfit_3", "outfit_4"])
        writer.writerows(all_rows)
    print("Final CSV saved as outfits_dataset.csv")


if __name__ == "__main__":
    main()
