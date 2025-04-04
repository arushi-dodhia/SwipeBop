import boto3
import uuid
from botocore.exceptions import ClientError
from datetime import datetime
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
table_name = 'outfits'
table = dynamodb.Table(table_name)

def insert_outfit(user_id, outfit):
    outfit_id = uuid.uuid4()

    try:
        table.put_item(
            Item={
                'user_id': user_id,
                'outfit_id': str(outfit_id),
                'outfit': outfit,
                'timestamp': datetime.now().time()
            }
        )
    except ClientError as e:
        raise Exception(f"Unable to insert outfit: {e.response['Error']['Message']}")
    
def get_outfits(user_id):
    try:
        response = table.query(
            KeyConditionExpression=Key('user_id').eq(user_id)
        )
        return response.get('Items', [])
    except ClientError as e:
        raise Exception(f"Query failed: {e.response['Error']['Message']}")
    
def get_outfit(user_id, outfit_id):
    try:
        response = table.get_item(
            Key={
                'user_id': user_id,
                'outfit_id': outfit_id
            }
        )
        return response.get('Item')
    except ClientError as e:
        raise Exception(f"Get outfit failed: {e.response['Error']['Message']}")

def remove_outfit(user_id, outfit_id):
    try:
        table.delete_item(
            Key={
                'user_id': user_id,
                'outfit_id': outfit_id
            }
        )
    except ClientError as e:
        raise Exception(f"Delete failed: {e.response['Error']['Message']}")

def remove_outfits(user_id):
    try:
        response = table.query(
            KeyConditionExpression=Key('user_id').eq(user_id)
        )
        items = response.get('Items', [])
        for item in items:
            table.delete_item(
                Key={
                    'user_id': user_id,
                    'outfit_id': item['outfit_id']
                }
            )
    except ClientError as e:
        raise Exception(f"Delete failed: {e.response['Error']['Message']}")
