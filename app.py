import requests
from flask import Flask, request, jsonify
from cachetools import LFUCache

app = Flask(__name__)

# External API Base URL
baseURL = "https://api.shopbop.com"
baseIMGURL = "https://m.media-amazon.com/images/G/01/Shopbop/p"

# API Headers
headers = {
    "accept": "application/json",
    "Client-Id": "Shopbop-UW-Team2-2024",
    "Client-Version": "1.0.0"
}

cache = LFUCache(maxsize=100)
def fetch_from_api(url, params):
    cache_key = f"{url}-{params}"

    if cache_key in cache:
        return cache[cache_key]

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        cache[cache_key] = data
        return data

    except requests.exceptions.RequestException as e:
        print("Error:", e)
        return None


@app.route("/api/search", methods=["GET"])
def search_products():
    q = request.args.get("q", "shirts")
    limit = request.args.get("limit", 10)
    lang = request.args.get("lang", "en-US")
    dept = request.args.get("dept", "WOMENS")
    allowOutOfStockItems = request.args.get("allowOutOfStockItems", "false")

    url = baseURL + "/public/search"
    params = {
        "q": q,
        "limit": limit,
        "dept": dept,
        "lang": lang,
        "allowOutOfStockItems": allowOutOfStockItems,
    }

    products = fetch_from_api(url, params)
    return jsonify(products if products else {"error": "Failed to fetch data"})


@app.route("/api/categories", methods=["GET"])
def get_categories():
    lang = request.args.get("lang", "en-US")
    dept = request.args.get("dept", "WOMENS")

    url = baseURL + "/public/folders"
    params = {"dept": dept, "lang": lang}

    categories = fetch_from_api(url, params)
    return jsonify(categories if categories else {"error": "Failed to fetch data"})


@app.route("/api/browse", methods=["GET"])
def browse_by_category():
    q = request.args.get("q", "shirts")
    category_id = request.args.get("id", "13198")
    limit = request.args.get("limit", 10)
    lang = request.args.get("lang", "en-US")
    dept = request.args.get("dept", "WOMENS")
    allowOutOfStockItems = request.args.get("allowOutOfStockItems", "false")

    url = f"{baseURL}/public/categories/{category_id}/products"
    params = {
        "q": q,
        "limit": limit,
        "dept": dept,
        "lang": lang,
        "allowOutOfStockItems": allowOutOfStockItems,
    }

    products = fetch_from_api(url, params)
    return jsonify(products if products else {"error": "Failed to fetch data"})


@app.route("/api/outfits", methods=["GET"])
def get_outfits():
    productSin = request.args.get("productSin", "1521306412")
    lang = request.args.get("lang", "en-US")

    url = f"{baseURL}/public/products/{productSin}/outfits"
    params = {"lang": lang}

    outfits = fetch_from_api(url, params)
    return jsonify(outfits if outfits else {"error": "Failed to fetch data"})


if __name__ == "__main__":
    app.run(debug=True)
