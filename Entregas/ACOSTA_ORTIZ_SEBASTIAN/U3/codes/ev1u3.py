import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Dataset simulado
data = {
    "edad": [25,40,32,19,50,45,22,37,29,55],
    "meses": [3,18,10,1,24,20,5,12,8,30],
    "uso": [12,3,8,15,4,2,14,6,10,1],
    "tickets": [3,0,1,4,1,0,2,1,3,0],
    "abandono": [1,0,0,1,0,0,1,0,1,0]
}

df = pd.DataFrame(data)

# Variables
X = df[["edad","meses","uso","tickets"]]
y = df["abandono"]

# División
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Escalado
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Modelo
model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# Predicciones
y_pred = model.predict(X_test_scaled)

# Métricas
acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred)
rec = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print("Accuracy:", acc)
print("Precision:", prec)
print("Recall:", rec)
print("F1-score:", f1)
