import boto3
from botocore.exceptions import ClientError
from datetime import datetime
from boto3.dynamodb.conditions import Key
from zoneinfo import ZoneInfo

dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
table_name = 'discard'
table = dynamodb.Table(table_name)

def insert_item(user_id, product):
    product_id = product['productSin']
    time = datetime.now(ZoneInfo('America/Chicago')).isoformat(),

    try:
        table.put_item(
            Item={
                'user_id': user_id,
                'time': time,
                'product_id': product_id,
                'product': product
            }
        )
        return time
    except ClientError as e:
        raise Exception(f"Unable to insert item: {e.response['Error']['Message']}")

def get_items(user_id):
    try:
        response = table.query(
            KeyConditionExpression=Key('user_id').eq(user_id)
        )
        return response.get('Items', [])
    except ClientError as e:
        raise Exception(f"Query failed: {e.response['Error']['Message']}")

def get_item(user_id, product_id):
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
    
def remove_item(user_id, product_id):
    try:
        table.delete_item(
            Key={
                'user_id': user_id,
                'product_id': product_id
            }
        )
    except ClientError as e:
        raise Exception(f"Delete failed: {e.response['Error']['Message']}")
    
def remove_all_items(user_id):
    try:
        items = get_items(user_id)
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