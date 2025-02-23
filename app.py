import requests
from flask import Flask, jsonify, request
from cachetools import LFUCache

app = Flask(__name__)

SHOPBOP_CATALOG_API_URL = "https://api.shopbop.com/"

cache = LFUCache(maxsize=100)
@app.route("/swipebop/catalog/<string:productSin>", methods=["GET"])
def discardPile(productSin):
    if productSin in cache:
        return cache[productSin]
    
    try:
        response = requests.get(f"{SHOPBOP_CATALOG_API_URL}/{productSin}/outfits?lang=en-US")
        response = raise_for_status()

        item_data = response.json()
        cache[productSin] = item_data
        return jsonify(item_data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error":"failed to fetch item details", "details:":str(e)})
    
if __name___ == "__main__":
    app.run(debug=True)


    