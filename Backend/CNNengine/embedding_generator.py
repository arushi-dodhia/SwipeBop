import os
import torch
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
import numpy as np

IMAGES_DIR = "/home/ec2-user/SwipeBop/Backend/CNNengine/images"
EMBEDDINGS_DIR = "/home/ec2-user/SwipeBop/Backend/CNNengine/embeddings"

# IMAGES_DIR = "/Users/raihan/Desktop/classes/SwipeBop/Backend/CNNengine/images"
# EMBEDDINGS_DIR = "/Users/raihan/Desktop/classes/SwipeBop/Backend/CNNengine/embeddings"

mobilenet = models.mobilenet_v2(weights="DEFAULT")
mobilenet = torch.nn.Sequential(*list(mobilenet.children())[:-1])
mobilenet.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def generate_embedding(img_path):
    img = Image.open(img_path).convert('RGB')
    img_tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        features = mobilenet(img_tensor)  # (1, 1280, 7, 7)
        features = features.mean(dim=[2, 3])  # Average over 7x7 grid
        embedding = features.squeeze().numpy()  # Now (1280,)
    return embedding

def generate_and_save_embeddings():
    if not os.path.exists(EMBEDDINGS_DIR):
        os.makedirs(EMBEDDINGS_DIR)

    for filename in os.listdir(IMAGES_DIR):
        if filename.endswith(".jpg"):
            product_sin = filename.split(".")[0]
            emb_path = os.path.join(EMBEDDINGS_DIR, f"{product_sin}.npy")
            if os.path.exists(emb_path):
                continue  # Already embedded

            img_path = os.path.join(IMAGES_DIR, filename)
            try:
                emb = generate_embedding(img_path)
                np.save(emb_path, emb)
                print(f"Saved embedding for {product_sin}")
            except Exception as e:
                print(f"Failed to embed {product_sin}: {e}")

if __name__ == "__main__":
    generate_and_save_embeddings()
