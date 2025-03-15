import requests
import json

baseURL = "https://api.shopbop.com"
headers = {
    "accept": "application/json",
    "Client-Id": "Shopbop-UW-Team2-2024",
    "Client-Version": "1.0.0"
}

def fetch_items(query, color, limit=100):
    url = f"{baseURL}/public/search"
    params = {
        "lang": "en-US",
        "dept": "WOMENS",
        "q": "jacket",
        "colors": color,
        "limit": limit,
        "sort": "ratings"
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {color}: {e}")
        return None
    
def main():
    query = "jacket"
    colors = ["Black", "White", "Red"]
    combined_products = []

    for color in colors:
        print(f"Fetching {color} items...")
        data = fetch_items(query, color, limit=100)
        if data and "products" in data:
            products = data["products"]
            for product in products:
                if "colors" not in product or not product["colors"]:
                    product["colors"] = {"name": color}
                else:
                    if "name" not in product["colors"]:
                        product["colors"]["name"] = color
                combined_products.append(product)
        else:
            print(f"No data returned for {color}")
    print(f"Total products fetched: {len(combined_products)}")

    with open("training_data.json", "w") as f:
        json.dump(combined_products, f, indent = 2)
    print("Data saved to training_data")

if __name__ == "__main__":
    main()