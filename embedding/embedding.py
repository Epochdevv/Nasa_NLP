import os
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans, DBSCAN
from sklearn.metrics import silhouette_score
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import seaborn as sns

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
abstracts_path = os.path.join(script_dir, 'abstracts.csv')

# Step 1: Load the data
print("Loading abstracts from CSV...")
df = pd.read_csv(abstracts_path)
print(f"Total rows loaded: {len(df)}")

# Display first few rows to understand structure
print("\nFirst few rows:")
print(df.head())

# Step 2: Filter out empty abstracts
# Assuming columns are 'id' and 'abstract' (adjust if needed)
# Handle different possible column names
if 'abstract' in df.columns:
    text_col = 'abstract'
elif 'text' in df.columns:
    text_col = 'text'
else:
    text_col = df.columns[1]  # Assume second column is text

if 'id' in df.columns:
    id_col = 'id'
else:
    id_col = df.columns[0]  # Assume first column is id

# Filter out empty/null abstracts
df_clean = df[df[text_col].notna() & (df[text_col].str.strip() != '')].copy()
print(f"\nAbstracts after removing empty ones: {len(df_clean)}")

# Step 3: Generate embeddings
print("\nLoading embedding model (all-MiniLM-L6-v2)...")
model = SentenceTransformer('all-MiniLM-L6-v2')

print("Generating embeddings (this may take a moment)...")
embeddings = model.encode(df_clean[text_col].tolist(), show_progress_bar=True)
print(f"Embeddings shape: {embeddings.shape}")

# Step 4: Determine optimal number of clusters using elbow method
print("\nDetermining optimal number of clusters...")
inertias = []
silhouette_scores = []
K_range = range(2, min(11, len(df_clean)))

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(embeddings)
    inertias.append(kmeans.inertia_)
    silhouette_scores.append(silhouette_score(embeddings, kmeans.labels_))

# Step 5: Perform K-means clustering with optimal k
# Use silhouette score to find best k
optimal_k = K_range[np.argmax(silhouette_scores)]
print(f"Optimal number of clusters (by silhouette score): {optimal_k}")

kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
clusters = kmeans.fit_predict(embeddings)

# Add cluster labels to dataframe
df_clean['cluster'] = clusters

# Step 6: Display clustering results
print("\n" + "="*60)
print("CLUSTERING RESULTS")
print("="*60)

for cluster_id in range(optimal_k):
    cluster_data = df_clean[df_clean['cluster'] == cluster_id]
    print(f"\nCluster {cluster_id} ({len(cluster_data)} abstracts):")
    print("-" * 60)
    for idx, row in cluster_data.head(3).iterrows():
        abstract_preview = row[text_col][:200] + "..." if len(row[text_col]) > 200 else row[text_col]
        print(f"  ID: {row[id_col]}")
        print(f"  Preview: {abstract_preview}\n")

# Step 7: Save results to CSV
output_file = os.path.join(script_dir, 'abstracts_clustered.csv')
df_clean.to_csv(output_file, index=False)
print(f"\nResults saved to: {output_file}")

# Step 8: Visualize clusters using t-SNE
print("\nGenerating t-SNE visualization...")
tsne = TSNE(n_components=2, random_state=42, perplexity=min(30, len(df_clean)-1))
embeddings_2d = tsne.fit_transform(embeddings)

# Create visualization
plt.figure(figsize=(12, 8))
scatter = plt.scatter(embeddings_2d[:, 0], embeddings_2d[:, 1], 
                     c=clusters, cmap='tab10', alpha=0.6, s=100)
plt.colorbar(scatter, label='Cluster')
plt.title(f'Abstract Clusters Visualization (t-SNE)\n{len(df_clean)} abstracts in {optimal_k} clusters')
plt.xlabel('t-SNE dimension 1')
plt.ylabel('t-SNE dimension 2')
plt.grid(True, alpha=0.3)
plt.tight_layout()
visualization_file = os.path.join(script_dir, 'clusters_visualization.png')
plt.savefig(visualization_file, dpi=300, bbox_inches='tight')
print("Visualization saved to: clusters_visualization.png")
plt.show()

# Step 9: Generate cluster statistics
print("\n" + "="*60)
print("CLUSTER STATISTICS")
print("="*60)
cluster_counts = df_clean['cluster'].value_counts().sort_index()
for cluster_id, count in cluster_counts.items():
    percentage = (count / len(df_clean)) * 100
    print(f"Cluster {cluster_id}: {count} abstracts ({percentage:.1f}%)")

print("\n" + "="*60)
print("ANALYSIS COMPLETE!")
print("="*60)
print(f"Total abstracts processed: {len(df_clean)}")
print(f"Number of clusters: {optimal_k}")
print(f"Output file: {output_file}")
print(f"Visualization: clusters_visualization.png")