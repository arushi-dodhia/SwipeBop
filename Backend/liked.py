import boto3
import time
import requests

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('liked')

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

    table.put_item(
        Item={
            'user_id': user_id,
            'product_id': product_id,
            'time': timestamp,
            'product_details': product_details
        }
    )

# Check for items liked by the user
def checkLikedItems(user_id, product_id):