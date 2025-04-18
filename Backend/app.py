import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from cachetools import LFUCache
import json
import sys
import discard
import outfit
import liked

# rec engine stuff
from CNNengine.cnn_recommender import build_catalog_embeddings, build_user_embedding, recommend_products

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
        # if params.get("limit"):
        #     params["limit"] = int(params["limit"])
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

###new code


def filter_product_data(raw_products):
    filtered_products = []
    for item in raw_products:
        product = item.get('product', {})
        filtered = {
            "productSin": product.get("productSin"),
            "productCode": product.get("productCode"),
            "shortDescription": product.get("shortDescription"),
            "designerName": product.get("designerName"),
            "price": product.get("retailPrice", {}).get("price"), 
            "inStock": product.get("inStock"),
        }
        
        colors = product.get("colors", [])
        if colors and isinstance(colors, list):
            images = colors[0].get("images", [])
            if images and isinstance(images, list):
                filtered["imageURL"] = baseIMGURL + images[0].get("src", "")
            else:
                filtered["imageURL"] = None
        else:
            filtered["imageURL"] = None

        filtered_products.append(filtered)
    return filtered_products


@app.route("/swipebop/search_filtered", methods=["GET"])
def search_products_filtered():
    
    allowOutOfStockItems = request.args.get("allowOutOfStockItems", "false").lower()
    q = request.args.get("q", "shirts")
    sort = request.args.get("sort", "ratings")
    minPrice = request.args.get("minPrice", "0")
    maxPrice = request.args.get("maxPrice", "1000000")
    limit = request.args.get("limit", "100")
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
        # "limit": limit,
        "dept": dept,
        "lang": lang,
        "offset": offset
    }

    sanitize_response = sanitize_data(params)
    if sanitize_response:
        return sanitize_response

    raw_data = fetch_from_shopbop(url, params)
    if not isinstance(raw_data, dict):
        return jsonify({"error": "Failed to fetch data"}), 500

    raw_products = raw_data.get("products", [])
    if not raw_products:
        return jsonify({"error": "No products found"}), 404

    filtered_products = filter_product_data(raw_products)
    return jsonify({"products": filtered_products})

### end

@app.route("/swipebop/search", methods=["GET"])
def search_products():
    # Parse + Defaults
    allowOutOfStockItems = request.args.get("allowOutOfStockItems", "false").lower()
    q = request.args.get("q", "shirts")
    sort = request.args.get("sort", "ratings") # sort by ratings cuz we wanna get popular items????
    minPrice = request.args.get("minPrice", "0")
    maxPrice = request.args.get("maxPrice", "1000000")
    limit = request.args.get("limit", "100")
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
        # "limit": limit,
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
    limit = request.args.get("limit", "100")
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
        # "limit": limit,
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

@app.route("/swipebop/images", methods=["GET"])
def get_images():
    color_idx = int(request.args.get("colorIdx", "0"))
    allowOutOfStockItems = request.args.get("allowOutOfStockItems", "false").lower()
    q = request.args.get("q", "shirts")
    sort = request.args.get("sort", "ratings") # sort by ratings cuz we wanna get popular items????
    minPrice = request.args.get("minPrice", "0")
    maxPrice = request.args.get("maxPrice", "1000000")
    limit = request.args.get("limit", "100")
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
        # "limit": limit,
        "dept": dept,
        "lang": lang,
        "offset": offset
    }

    sanitize_data_response = sanitize_data(params)
    if sanitize_data_response:
        return sanitize_data_response
    
    response = fetch_from_shopbop(url, params)
    if not isinstance(response, dict):
        return jsonify({"error": "Failed to retrieve products "}), 500
    
    img_urls = {}
    products = response.get("products", [])
    if not products:
        return jsonify({"error": "No products found"}), 404

    for product in products:
        try:
            product_sin = product['product']['productSin']
            img_src = product['product']['colors'][color_idx]['images'][0]['src']
            img_urls[product_sin] = f"{baseIMGURL}/{img_src}"
        except (KeyError, IndexError):
            continue

    return jsonify(img_urls if img_urls else {"error": "Failed to fetch image URLs"})

@app.route('/swipebop/discard/insert', methods=['POST'])
def insert_discarded():
    data = request.json
    user_id = data.get('user_id')
    product = data.get('product')

    if not user_id or not product:
        return jsonify({"error": "Missing user_id or product data"}), 400

    try:
        time_inserted = discard.insert_item(user_id, product)
        return jsonify({"status": "Item inserted", "time": time_inserted}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/swipebop/discard/<user_id>', methods=['GET'])
def get_discarded(user_id):
    try:
        items = discard.get_items(user_id)
        return jsonify({"items": items}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/swipebop/discard/<user_id>/<product_id>', methods=['GET'])
def get_discarded_item(user_id, product_id):
    try:
        item = discard.get_item(user_id, product_id)
        if item:
            return jsonify({"discarded_item": item}), 200
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/swipebop/discard/delete', methods=['POST'])
def delete_discarded():
    data = request.json
    user_id = data.get('user_id')
    product_id = data.get('product_id')

    if not user_id or not product_id:
        return jsonify({"error": "Missing user_id or time"}), 400

    try:
        discard.remove_item(user_id, product_id)
        return jsonify({"status": "Item removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/swipebop/discard/delete_all', methods=['POST'])
def delete_all_discarded():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    try:
        discard.remove_all_items(user_id)
        return jsonify({"status": "All discarded items removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/swipebop/outfits/insert', methods=['POST'])
def insert_outfit():
    data = request.json
    user_id = data.get('user_id')
    outfit_data = data.get('outfit')

    if not user_id or not outfit_data:
        return jsonify({"error": "Missing user_id or outfit data"}), 400

    try:
        outfit_id = outfit.insert_outfit(user_id, outfit_data)
        return jsonify({"status": "Outfit inserted", "outfit_id": outfit_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/swipebop/outfits/<user_id>', methods=['GET'])
def get_outfits_db(user_id):
    try:
        outfits = outfit.get_outfits(user_id)
        return jsonify({"outfits": outfits}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/swipebop/outfits/<user_id>/<outfit_id>', methods=['GET'])
def get_outfit(user_id, outfit_id):
    try:
        outfit = outfit.get_outfit(user_id, outfit_id)
        if outfit:
            return jsonify({"outfit": outfit}), 200
        else:
            return jsonify({"error": "Outfit not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/swipebop/outfits/delete', methods=['POST'])
def delete_outfit():
    data = request.json
    user_id = data.get('user_id')
    outfit_id = data.get('outfit_id')

    if not user_id or not outfit_id:
        return jsonify({"error": "Missing user_id or outfit_id"}), 400

    try:
        outfit.remove_outfit(user_id, outfit_id)
        return jsonify({"status": "Outfit removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/swipebop/outfits/delete_all', methods=['POST'])
def delete_all_outfits():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    try:
        outfit.remove_outfits(user_id)
        return jsonify({"status": "All outfits removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/swipebop/liked/insert', methods=['POST'])
def insertLiked():
    data = request.json
    user_id = data.get('user_id')
    product = data.get('product')

    if not user_id or not product:
        return jsonify({"error": "Missing user_id or product data"}), 400

    try:
        time_inserted = liked.likeItem(user_id, product)
        return jsonify({"status": "Item inserted", "time": time_inserted}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/swipebop/liked/<user_id>', methods=['GET'])
def getLikedItems(user_id):
    try:
        items = liked.getLikedItems(user_id)
        return jsonify({"items": items}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/swipebop/liked/<user_id>/<product_id>', methods=['GET'])
def getLikedItem(user_id, product_id):
    try:
        item = liked.getLikedItem(user_id, product_id)
        if item:
            return jsonify({"likedItem": item}), 200
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/swipebop/liked/delete', methods=['POST'])
def deleteLiked():
    data = request.json
    user_id = data.get('user_id')
    product_id = data.get('product_id')

    if not user_id or not product_id:
        return jsonify({"error": "Missing user_id or product_id"}), 400

    try:
        liked.removeLikedItem(user_id, product_id)
        return jsonify({"status": "Item removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

@app.route('/swipebop/liked/delete_all', methods=['POST'])
def delete_all_liked():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    try:
        liked.removeAllLiked(user_id)
        return jsonify({"status": "All liked items removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/swipebop/recommendations/<user_id>', methods=['GET'])
def itemRecommendation(user_id):
    liked_items_data = liked.getLikedItems(user_id)
    liked_product_ids = [item['product']['productSin'] for item in liked_items_data]

    # if have no items liked ifs wtvr
    # if not liked_product_ids:
    #     continue

    search_url = "http://18.118.186.108:5000/swipebop/search_filtered?limit=10"
    products_response = requests.get(search_url)
    products_json = products_response.json()

    catalog_embeddings = build_catalog_embeddings(products_json)
    user_emb = build_user_embedding(liked_product_ids, catalog_embeddings)
    if user_emb is None:
        print("bad thing happened")
    
    recommendations = recommend_products(user_emb, catalog_embeddings, exclude_ids=liked_product_ids, top_n=10)
    recommended_product_ids = [pid for pid, score in recommendations]

    return jsonify({
        "recommended_productSin": recommended_product_ids
    })