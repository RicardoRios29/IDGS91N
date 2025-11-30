import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 1. Cargar y separar los datos
file_path = "Matriz.csv"
df = pd.read_csv(file_path)

# Variables predictoras (X) y variable objetivo (y)
X = df[['glucosa', 'edad']]
y = df['etiqueta']

# 2. Dividir el conjunto en entrenamiento (70%) y prueba (30%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# 3. Escalar las variables predictoras (Normalización)
scaler = StandardScaler()

# Ajustar el escalador SÓLO con los datos de entrenamiento y transformar ambos conjuntos
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Los resultados X_train_scaled y X_test_scaled son ahora los datos listos
# para ser utilizados en el entrenamiento y prueba del modelo KNN.

# Se han guardado los conjuntos escalados y divididos en archivos CSV para un fácil acceso:
# X_train_scaled.csv
# X_test_scaled.csv
# y_train.csv
# y_test.csv