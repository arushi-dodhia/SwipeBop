import random
import time
import requests
from liked import likeItem

DESIRED_COUNT = 500

def gather_product_ids(desired_count=500):
    queries = ["dress", "shoes", "jeans", "shirt", "bag", "coat"]
    colors = ["Black"]
    all_ids = set()

    while len(all_ids) < desired_count:
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
                if "productSin" in p:
                    all_ids.add(p["productSin"])

            print(f"Fetched {len(products)} products for query='{query}', color='{color}'. "
                  f"Total unique so far: {len(all_ids)}")

        except Exception as e:
            print(f"Error retrieving products (query={query}, color={color}, offset={offset}): {e}")
        time.sleep(0.5)

    return all_ids


def main():
    user_id = "fakeUser1"
    product_ids = gather_product_ids(DESIRED_COUNT)

    print(f"\nInserting {len(product_ids)} total items into 'liked' for user='{user_id}'\n")

    inserted_count = 0
    for pid in product_ids:
        try:
            likeItem(user_id, pid)
            inserted_count += 1
        except Exception as e:
            print(f"Error calling likeItem for productSin={pid}: {e}")

    print(f"\nSuccessfully inserted {inserted_count} items for user '{user_id}'.\n")


if __name__ == "__main__":
    main()
