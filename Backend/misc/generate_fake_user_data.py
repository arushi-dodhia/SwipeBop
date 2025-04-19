import random
import time
import requests
from liked import likeItem

DESIRED_COUNT = 100

def gather_product_data(desired_count=500):
    queries = ["shoes", "jeans", "shirt", "coat"]
    colors = ["Black", "Red"]
    all_products = []

    while len(all_products) < desired_count:
        query = random.choice(queries)
        color = random.choice(colors)
        offset = random.randint(0, 2000)

        params = {
            "q": query,
            "colors": color,
            "offset": offset,
            "allowOutOfStockItems": "false",
            "sort": "ratings",
            "minPrice": "0",
            "maxPrice": "2000"
        }

        try:
            resp = requests.get(
                "http://18.118.186.108:5000/swipebop/search_filtered",
                params=params,
                timeout=10
            )
            resp.raise_for_status()
            data = resp.json()

            products = data.get("products", [])
            for p in products:
                if p.get("productSin"):
                    all_products.append(p)

            print(f"Fetched {len(products)} products for query='{query}', color='{color}'. "
                  f"Total collected so far: {len(all_products)}")

        except Exception as e:
            print(f"Error retrieving products (query={query}, color={color}, offset={offset}): {e}")
        time.sleep(0.5)

    return all_products[:desired_count]

def main():
    user_id = "fakeUserA"
    products = gather_product_data(DESIRED_COUNT)

    print(f"\nInserting {len(products)} total items into 'liked' for user='{user_id}'\n")

    inserted_count = 0
    for p in products:
        try:
            # 👇 IMPORTANT: Wrap everything under 'product'
            wrapped_product = {
                "product": {
                    "productSin": str(p.get("productSin")),
                    "shortDescription": p.get("shortDescription", ""),
                    "designerName": p.get("designerName", ""),
                    "price": str(p.get("price", "")),
                    "imageURL": p.get("imageURL", "")
                }
            }
            likeItem(user_id, wrapped_product)
            inserted_count += 1
        except Exception as e:
            print(f"Error calling likeItem for productSin={p.get('productSin')}: {e}")

    print(f"\nSuccessfully inserted {inserted_count} items for user '{user_id}'.\n")

if __name__ == "__main__":
    main()
