import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

# 1. Preparación de Datos de Ejemplo (Sustituye por tus datos reales)
np.random.seed(42)
X = np.random.rand(100, 3) * 10
y = 1.5 * X[:, 0] + 2.0 * X[:, 1] - 0.5 * X[:, 2] + 5 + np.random.randn(100) * 2

df = pd.DataFrame(X, columns=['Feature_A', 'Feature_B', 'Feature_C'])
df['Target'] = y

# 2. División de Datos y Entrenamiento del Modelo
X_train, X_test, y_train, y_test = train_test_split(df[['Feature_A', 'Feature_B', 'Feature_C']], df['Target'], test_size=0.3, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# 3. Cálculo de Residuos
residuals = y_test - y_pred

# --- GRÁFICAS E INTERPRETACIÓN ---

## 📊 1. Gráfico de Dispersión (Valores Reales vs. Predichos)

plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, color='blue', alpha=0.6)
# Dibuja la línea de predicción perfecta (y=x)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel(r"Valores Reales ($Y_{test}$)")
plt.ylabel(r"Valores Predichos ($\hat{Y}$)")
plt.title("1. Dispersión: Reales vs. Predichos")
plt.grid(True, linestyle='--', alpha=0.7)
plt.show()


## 📉 2. Gráfico de Residuos (Valores Predichos vs. Residuos)

plt.figure(figsize=(8, 6))
plt.scatter(y_pred, residuals, color='purple', alpha=0.6)
# Dibuja la línea horizontal en Residuos = 0
plt.axhline(y=0, color='r', linestyle='-', linewidth=1)
plt.xlabel(r"Valores Predichos ($\hat{Y}$)")
plt.ylabel(r"Residuos ($Y_{real} - \hat{Y}$)")
plt.title("2. Gráfico de Residuos")
plt.grid(True, linestyle='--', alpha=0.7)
plt.show()


## 📈 3. Gráfico de Barras de Coeficientes/Importancia de Características

# Usamos el intercepto y los coeficientes del modelo
feature_names = X_train.columns.tolist()
coefficients = [model.intercept_] + model.coef_.tolist()
labels = ['Intercepto'] + feature_names

# Convertimos a serie para facilitar el ploteo
coef_series = pd.Series(coefficients, index=labels)

plt.figure(figsize=(10, 6))

# Usamos el valor absoluto para ordenar y ver la magnitud del impacto
coef_series.abs().sort_values(ascending=False).plot(kind='bar', color='darkorange')
plt.ylabel("Magnitud Absoluta del Coeficiente")
plt.title("3. Importancia de las Características (Magnitud Absoluta de Coeficientes)")
plt.xticks(rotation=45, ha='right')
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()