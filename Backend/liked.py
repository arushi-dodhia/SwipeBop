import boto3
import time
import requests
from decimal import Decimal
from botocore.exceptions import ClientError
from datetime import datetime
from boto3.dynamodb.conditions import Key
from zoneinfo import ZoneInfo

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
def likeItem(user_id, product):
    time_str = datetime.now(ZoneInfo('America/Chicago')).isoformat(),
    # if someone _did_ wrap it, strip off the extra layer:
    if 'product' in product and isinstance(product['product'], dict):
        product = product['product']
    product_id = product['productSin']
    table.put_item(Item={
        'user_id':     user_id,
        'product_id':  product_id,
        'time':        time_str,
        'product':     product,   # now a flat dict
    })
    return time_str

# Get all items liked by a user
def getLikedItems(user_id):
    try:
        response = table.query(
            KeyConditionExpression = Key('user_id').eq(user_id)
        )
        return response.get('Items', [])
    except ClientError as e:
        raise Exception(f"Query failed: {e.response['Error']['Message']}")
    

# Check for item liked by the user
def getLikedItem(user_id, product_id):
    try:
        response = table.get_item(
            Key={
                'user_id': user_id,
                'product_id': product_id
            }
        )
        return response.get('Item')
    except ClientError as e:
        raise Exception(f"Get item failed: {e.response['Error']['Message']}")

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
    
def removeAllLiked(user_id):
    try:
        items = getLikedItems(user_id)
        for item in items:
            product_id = item['product_id']
            table.delete_item(
                Key={
                    'user_id': user_id,
                    'product_id': product_id
                }
            )
    except ClientError as e:
        raise Exception(f"Delete failed: {e.response['Error']['Message']}")

# Add an item and check for item
# likeItem("fakeUser1", "1521306412")
# getLikedItems("200")
# getLikedItem("200", "1521306413")
# removeLikedItem("200", "1521306412")

