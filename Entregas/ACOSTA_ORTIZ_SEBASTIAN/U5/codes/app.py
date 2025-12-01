import streamlit as st
import pandas as pd
import plotly.express as px
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

# --- CONFIGURACIÓN ---
st.set_page_config(page_title="Dashboard KNN", layout="wide")

st.title("Dashboard de Visualización – Modelo KNN (Glucosa y Edad)")

# Cargar datos
df = pd.read_csv("Matriz.csv")

# Preparación para modelo
X = df[["glucosa", "edad"]]
y = df["etiqueta"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.3, random_state=42
)

knn = KNeighborsClassifier(n_neighbors=1)
knn.fit(X_train, y_train)

df["pred"] = knn.predict(X_scaled)

# --- GRÁFICA 1: DISTRIBUCIÓN ---
st.subheader("1. Distribución de Glucosa (Histograma)")
fig1 = px.histogram(df, x="glucosa", nbins=10, color="etiqueta",
                    title="Distribución de niveles de glucosa",
                    labels={"glucosa": "Nivel de glucosa"})
st.plotly_chart(fig1, use_container_width=True)

# --- GRÁFICA 2: RELACIÓN ---
st.subheader("2. Relación Edad vs Glucosa (Scatter Plot)")
fig2 = px.scatter(df, x="edad", y="glucosa", color="etiqueta",
                  title="Relación Edad - Glucosa por etiqueta")
st.plotly_chart(fig2, use_container_width=True)

# --- GRÁFICA 3: PROPORCIÓN ---
st.subheader("3. Composición de etiquetas (Pie Chart)")
fig3 = px.pie(df, names="etiqueta", title="Proporción de etiquetas")
st.plotly_chart(fig3, use_container_width=True)

st.success("Dashboard generado exitosamente.")
