import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import f1_score

# Cargar los datos preparados
X_train_scaled = pd.read_csv("X_train_scaled.csv").values
X_test_scaled = pd.read_csv("X_test_scaled.csv").values
y_train = pd.read_csv("y_train.csv").squeeze()
y_test = pd.read_csv("y_test.csv").squeeze()

# Definir k valores a probar
k_values = [3, 5, 7]
results = {}

# Iterar sobre los valores de k
for k in k_values:
    # Entrenar el modelo KNN
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train_scaled, y_train)

    # Predecir en el conjunto de prueba
    y_pred = knn.predict(X_test_scaled)

    # Calcular F1-score
    f1 = f1_score(y_test, y_pred, average='binary')
    results[k] = f1

# Seleccionar el mejor k
best_k = max(results, key=results.get)
best_f1_score = results[best_k]