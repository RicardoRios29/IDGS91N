import pandas as pd
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# --- DATASET ---
data = load_wine()
X = pd.DataFrame(data.data, columns=data.feature_names)

# Escalado
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# --- CLUSTERING ---
kmeans = KMeans(n_clusters=3, random_state=42)
labels = kmeans.fit_predict(X_scaled)

sil = silhouette_score(X_scaled, labels)
dbi = davies_bouldin_score(X_scaled, labels)
chi = calinski_harabasz_score(X_scaled, labels)

# --- PCA ---
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# Varianza explicada
var_exp = pca.explained_variance_ratio_.sum()

# Reconstrucción
X_rec = pca.inverse_transform(X_pca)
reconstruction_error = ((X_scaled - X_rec)**2).mean()

plt.scatter(X_pca[:,0], X_pca[:,1], c=labels, cmap='viridis')
plt.title("Clusters K-means proyectados con PCA")
plt.xlabel("PC1")
plt.ylabel("PC2")
plt.show()

plt.bar(["PC1","PC2"], pca.explained_variance_ratio_)
plt.title("Varianza explicada por componente")
plt.show()