import boto3
import time

session = boto3.Session(profile_name="ryan-profile-1") 
dynamodb = session.resource("dynamodb", region_name="us-east-2")

table = dynamodb.Table("DiscardedItems")

def discard_item(user_id, product_id):
    timestamp = int(time.time())

    table.put_item(
        Item={
            "user_id": user_id,
            "product_id": product_id,
            "time": timestamp
        }
    )

    return {"message": f"Item {product_id} discarded for user {user_id}"}

# print(discard_item("user123", "1569471937"))

def check_item(user_id, product_id):
    response = table.get_item(
        Key={"user_id": user_id, "product_id": product_id}
    )

    if "Item" in response:
        print(f"Item {product_id} exists for user {user_id}: {response['Item']}")
        return True
    else:
        print(f"Item {product_id} not found for user {user_id}")
        return False

check_item("user123", "1569471937")

# def create_table():
#     table_name = "DiscardedItems"

#     response = dynamodb.create_table(
#         TableName=table_name,
#         KeySchema=[
#             {"AttributeName": "user_id", "KeyType": "HASH"},  # Partition key
#             {"AttributeName": "product_id", "KeyType": "RANGE"}  # Sort key
#         ],
#         AttributeDefinitions=[
#             {"AttributeName": "user_id", "AttributeType": "S"},
#             {"AttributeName": "product_id", "AttributeType": "S"}
#         ],
#         BillingMode="PAY_PER_REQUEST"
#     )

#     return response

# Run this once to create the table
# print(create_table())
