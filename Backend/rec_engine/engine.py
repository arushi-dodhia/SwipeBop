import json
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors

with open("training_data.json", "r") as f:
    data = json.load(f)

colors = []
for item in data:
    color_name = item.get("colors", {}).get("name", "unknown")
    colors.append(color_name.lower())

print("Extracted colors for first 10 items:", colors[:10])

le = LabelEncoder()
color_int = le.fit_transform(colors).reshape(-1, 1)
ohe = OneHotEncoder(sparse=False)
features = ohe.fit_transform(color_int)

print("Feature matrix shape:", features.shape)

knn = NearestNeighbors(n_neighbors=5, metric="euclidean")
knn.fit(features)

pca = PCA(n_components=2)
features_2d = pca.fit_transform(features)

np.random.seed(42)``
initial_index = np.random.choice(range(features.shape[0]))
user_pref = features[initial_index].astype(float)

trajectory = [] 
recommended_indices = []  

alpha = 0.3
num_iterations = 10

for i in range(num_iterations):
    distances, indices = knn.kneighbors([user_pref])
    rec_index = indices[0][0]
    recommended_indices.append(rec_index)
    user_pref_2d = pca.transform(user_pref.reshape(1, -1))[0]
    trajectory.append(user_pref_2d)
    rec_feature = features[rec_index]
    user_pref = (1 - alpha) * user_pref + alpha * rec_feature

trajectory = np.array(trajectory)
plt.figure(figsize=(8, 6))
plt.scatter(features_2d[:, 0], features_2d[:, 1], c='gray', alpha=0.6, label="Products")
plt.plot(trajectory[:, 0], trajectory[:, 1], '-o', color='red', label="User Preference Trajectory")

for rec_idx in recommended_indices:
    rec_point = pca.transform(features[rec_idx].reshape(1, -1))[0]
    plt.scatter(rec_point[0], rec_point[1], marker='x', s=100, color='blue', label="Recommended" if rec_idx == recommended_indices[0] else "")

plt.title("KNN Recommendation: User Preference Trajectory")
plt.xlabel("PCA Component 1")
plt.ylabel("PCA Component 2")
plt.legend()
plt.grid(True)
plt.show()