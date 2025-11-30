import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt


# Cargar dataset (sintético o real)
df = pd.read_csv("ventas_juegos_indie.csv")  # Ajustar el nombre del archivo si tenemos un archivo diferente

# Preprocesamiento y selección de variables
# Variables categóricas → codificación
df_encoded = pd.get_dummies(df, columns=["genero", "distribucion", "mes_lanzamiento"], drop_first=True)

# Definición de X (entrada) y Y (objetivo)
X = df_encoded.drop(["nombre_juego", "ventas_en_miles"], axis=1)
y = df_encoded["ventas_en_miles"]

# Escalado de variables
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# División del dataset en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3, random_state=42)

#Entrenamiento del modelo de regresión lineal
modelo = LinearRegression()
modelo.fit(X_train, y_train)

#Cálculo de métricas de evaluación
y_pred = modelo.predict(X_test)

# Métricas
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)


# Crear gráfico de dispersión
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, color='blue', alpha=0.7, label='Predicciones')
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], color='red', linestyle='--', label='Línea ideal')
plt.xlabel('Ventas reales (en miles)')
plt.ylabel('Ventas predichas (en miles)')
plt.title('Comparación entre valores reales y predichos')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

# Cálculo de residuos
residuos = y_test - y_pred

# Gráfico de residuos
plt.figure(figsize=(8, 6))
plt.scatter(y_pred, residuos, color='purple', alpha=0.7)
plt.axhline(y=0, color='red', linestyle='--')
plt.xlabel('Ventas predichas (en miles)')
plt.ylabel('Residuos (ventas reales - predichas)')
plt.title('Gráfico de residuos del modelo de regresión lineal')
plt.grid(True)
plt.tight_layout()
plt.show()

# Histograma de errores absolutos
errores = np.abs(residuos)

plt.figure(figsize=(8, 6))
plt.hist(errores, bins=8, color='orange', edgecolor='black', alpha=0.75)
plt.xlabel('Error absoluto (en miles)')
plt.ylabel('Frecuencia')
plt.title('Distribución de errores absolutos del modelo')
plt.grid(True)
plt.tight_layout()
plt.show()
