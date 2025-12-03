import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_curve, auc
import matplotlib.pyplot as plt

# Cargar datos desde archivo o dict (simulado)
df = pd.read_csv("Matriz.csv")  # glucosa, edad, etiqueta

X = df[["glucosa", "edad"]]
y = df["etiqueta"]

# División 70/30
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Escalado
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

scores = {}
for k in [1, 3, 5]:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train_scaled, y_train)
    y_pred = knn.predict(X_test_scaled)

    scores[k] = {
        "Accuracy": accuracy_score(y_test, y_pred),
        "Precision": precision_score(y_test, y_pred),
        "Recall": recall_score(y_test, y_pred),
        "F1": f1_score(y_test, y_pred)
    }

# Mejor k por F1
mejor_k = max(scores, key=lambda k: scores[k]["F1"])

print("Mejor k según F1:", mejor_k)
print(scores)

# Matriz de confusión
best_knn = KNeighborsClassifier(n_neighbors=mejor_k)
best_knn.fit(X_train_scaled, y_train)
y_pred = best_knn.predict(X_test_scaled)

cm = confusion_matrix(y_test, y_pred)
print(cm)

# Curva ROC
y_prob = best_knn.predict_proba(X_test_scaled)[:, 1]
fpr, tpr, th = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)

plt.plot(fpr, tpr)
plt.title(f"ROC - AUC={roc_auc:.2f}")
plt.xlabel("FPR")
plt.ylabel("TPR")
plt.grid()
plt.show()
