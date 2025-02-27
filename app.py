import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from cachetools import LFUCache
import json
import sys

app = Flask(__name__)
CORS(app)

baseURL = "https://api.shopbop.com"
baseIMGURL = "https://m.media-amazon.com/images/G/01/Shopbop/p"

headers = {
    "accept": "application/json",
    "Client-Id": "Shopbop-UW-Team2-2024",
    "Client-Version": "1.0.0"
}

# default parameters
departments = ["WOMENS", "MENS"]
languages = ["en-US", "ru-RU", "zh-CN"]
sort_terms = ["editors-pick", "exclusives",  "hearts",  "price-high-low",  "price-low-high", "ratings"]
# need other default parameters for sanitizing


cache = LFUCache(maxsize=10)
def fetch_from_shopbop(url, params):
    cache_key = f"{url}-{tuple(sorted(params.items()))}"

    if cache_key in cache:
        print("DEBUG: cache hit!", file=sys.stdout)
        return cache[cache_key]
    
    print("DEBUG: cache miss, fetching from ShopBop API", file=sys.stdout)
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        cache[cache_key] = data
        return data
    except requests.exceptions.RequestException as e:
        print("Error:", e)
        return jsonify({"error": "Failed to fetch data from external API", "details": str(e)}), 500

def sanitize_data(params):
    try:
        if params.get("minPrice"):
            params["minPrice"] = int(params["minPrice"])
        if params.get("maxPrice"):
            params["maxPrice"] = int(params["maxPrice"])
        if params.get("limit"):
            params["limit"] = int(params["limit"])
        if params.get("offset"):
            params["offset"] = int(params["offset"])
    except ValueError:
        return(jsonify({"error":"minPrice, maxPrice, limit, or offset is not an integer"}), 400)

    if params.get("allowOutOfStockItems"):
        if params["allowOutOfStockItems"] not in ["true", "false"]:
            return(jsonify({"error": "allowOutOfStockItems not a boolean"}), 400)
    if params.get("sort"):
        if params["sort"] not in sort_terms:
            return(jsonify({"error":"sort type is not available"}), 400)
    if params.get("dept"):
        if params["dept"] not in departments:
            return(jsonify({"error":"department not available"}), 400)
    if params.get("lang"):
        if params["lang"] not in languages:
            return(jsonify({"error":"language not available"}), 400)
    return None

@app.route("/swipebop/search", methods=["GET"])
def search_products():
    # Parse + Defaults
    allowOutOfStockItems = request.args.get("allowOutOfStockItems", "false").lower()
    q = request.args.get("q", "shirts")
    sort = request.args.get("sort", "ratings") # sort by ratings cuz we wanna get popular items????
    minPrice = request.args.get("minPrice", "0")
    maxPrice = request.args.get("maxPrice", "1000000")
    limit = request.args.get("limit", "10")
    dept = request.args.get("dept", "WOMENS")
    lang = request.args.get("lang", "en-US")
    offset = request.args.get("offset", "0")

    url = baseURL + "/public/search"
    params = {
        "allowOutOfStockItems": allowOutOfStockItems,
        "q": q,
        "sort": sort,
        "minPrice": minPrice,
        "maxPrice": maxPrice,
        "limit": limit,
        "dept": dept,
        "lang": lang,
        "offset": offset
    }

    sanitize_data_response = sanitize_data(params)
    if sanitize_data_response:
        return sanitize_data_response
    
    products = fetch_from_shopbop(url, params)
    return jsonify(products if products else {"error": "Failed to fetch data"})


@app.route("/swipebop/categories", methods=["GET"])
def get_categories():

    dept = request.args.get("dept", "WOMENS")
    lang = request.args.get("lang", "en-US")

    url = baseURL + "/public/folders"
    params = {
        "dept": dept,
        "lang": lang
    }

    sanitize_data_response = sanitize_data(params)
    if sanitize_data_response:
        return sanitize_data_response

    categories = fetch_from_shopbop(url, params)
    return jsonify(categories if categories else {"error": "Failed to fetch data"})


@app.route("/swipebop/browse", methods=["GET"])
def browse_by_category():
    allowOutOfStockItems = request.args.get("allowOutOfStockItems", "false").lower()
    lang = request.args.get("lang", "en-US")
    category_id = request.args.get("id", "13198")
    colors = request.args.get("colors", "Black")
    sort = request.args.get("sort", "ratings") # default sort by ratings cuz we wanna get popular items????
    minPrice = request.args.get("minPrice", "0")
    maxPrice = request.args.get("maxPrice", "1000000")
    limit = request.args.get("limit", "10")
    dept = request.args.get("dept", "WOMENS")
    q = request.args.get("q", "shirts")
    offset = request.args.get("offset", "0")

    url = f"{baseURL}/public/categories/{category_id}/products"
    params = {
        "allowOutOfStockItems": allowOutOfStockItems,
        "lang": lang,
        "category_id": category_id,
        "colors": colors,
        "sort": sort,
        "minPrice": minPrice,
        "maxPrice": maxPrice,
        "limit": limit,
        "dept": dept,
        "q": q,
        "offset": offset
    }

    sanitize_data_response = sanitize_data(params)
    if sanitize_data_response:
        return sanitize_data_response

    products = fetch_from_shopbop(url, params)
    return jsonify(products if products else {"error": "Failed to fetch data"})


@app.route("/swipebop/outfits", methods=["GET"])
def get_outfits():
    productSin = request.args.get("productSin", "1521306412")
    lang = request.args.get("lang", "en-US")

    url = f"{baseURL}/public/products/{productSin}/outfits"

    params = {
        "productSin": productSin,
        "lang": lang
    }

    sanitize_data_response = sanitize_data(params)
    if sanitize_data_response:
        return sanitize_data_response

    outfits = fetch_from_shopbop(url, params)
    return jsonify(outfits if outfits else {"error": "Failed to fetch data"})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
