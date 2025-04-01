import boto3
import time
import requests
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('liked')

# Schema for reference
# db liked {
# 	user_id text
# 	product_id text
# 	timestamp datetime
# 	product_details list
# }

def convert_floats_to_decimal(obj):
    if isinstance(obj, list):
        return [convert_floats_to_decimal(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_floats_to_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, float):
        return Decimal(str(obj))
    else:
        return obj

# Fetch product details from the SwipeBop API
def fetch_product_details(product_id):
    response = requests.get(f"http://3.142.196.127:5000/swipebop/outfits?productSin={product_id}")
    return response.json()

# Helper function for checking connection to DynamoDB
def check_connectivity():
    try:
        response = table.table_status
        print(f"Connected! Table status: {response}")
    except Exception as e:
        print("Error connecting to DynamoDB:", e)

# User likes an item
def likeItem(user_id, product_id):
    timestamp = int(time.time())
    product_details = fetch_product_details(product_id)
    product_details = convert_floats_to_decimal(product_details)

    table.put_item(
        Item = {
            'user_id': user_id,
            'product_id': product_id,
            'time': timestamp,
            'product_details': product_details
        }
    )
    print(f"{user_id} added {product_id} to their liked items list")
    return {"message": f"{user_id} added {product_id} to their liked items list"}

# Check for items liked by the user
def checkLikedItems(user_id, product_id):
    response = table.get_item(
        Key = {
            'user_id': user_id,
            'product_id': product_id
        }
    )

    item = response.get("Item")
    if item:
        print(f"Item(s) liked by user {user_id}: ", item)
    else:
        print("Item(s) not found")

# Add an item and check for item
# likeItem("200", "1521306412")
# checkLikedItems("100", "1521306412")