import boto3
import time
import requests
from decimal import Decimal
from botocore.exceptions import ClientError
from datetime import datetime
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
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
    response = requests.get(f"http://18.118.186.108:5000/swipebop/outfits?productSin={product_id}")
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
            'timestamp': timestamp,
            'product_details': product_details
        }
    )
    print(f"{user_id} added {product_id} to their liked items list")
    return {"message": f"{user_id} added {product_id} to their liked items list"}

# Get all items liked by a user
def getLikedItems(user_id):
    try:
        response = table.query(
            KeyConditionExpression = Key('user_id').eq(user_id)
        )
        count = len(response.get('Items', []))
        if response:
            print(f"Total items like by {user_id}: {count}")
            #print(f"Item(s) liked by user {user_id}: ", response)
        else:
            print("Item(s) not found")
        return response.get('Items', [])
    
    except ClientError as e:
        raise Exception(f"Query failed: {e.response['Error']['Message']}")

# Check for item liked by the user
def getLikedItem(user_id, product_id):
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

# Remove an item liked by the user
def removeLikedItem(user_id, product_id):
    try:
        table.delete_item(
            Key = {
                'user_id': user_id,
                'product_id': product_id
            }
        )
    except ClientError as e:
        raise Exception(f"Delete failed: {e.response['Error']['Message']}")

# Add an item and check for item
likeItem("fakeUser1", "1521306412")
# likeItem("200", "1521306413")
# likeItem("200", "1521306414")
# getLikedItems("200")
# getLikedItem("200", "1521306413")
# removeLikedItem("200", "1521306412")