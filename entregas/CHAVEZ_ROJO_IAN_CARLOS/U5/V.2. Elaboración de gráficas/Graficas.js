import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

const IndieGameSalesAnalysis = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Datos del modelo basados en el documento
  const modelMetrics = {
    mae: 8.45,
    rmse: 11.23,
    r2: 0.79
  };

  // Datos sintéticos para las visualizaciones
  const realVsPredicted = [
    { real: 25, predicho: 28, juego: "Juego 1" },
    { real: 45, predicho: 42, juego: "Juego 2" },
    { real: 60, predicho: 58, juego: "Juego 3" },
    { real: 35, predicho: 38, juego: "Juego 4" },
    { real: 75, predicho: 70, juego: "Juego 5" },
    { real: 50, predicho: 53, juego: "Juego 6" },
    { real: 30, predicho: 32, juego: "Juego 7" },
    { real: 65, predicho: 62, juego: "Juego 8" },
    { real: 40, predicho: 44, juego: "Juego 9" },
    { real: 55, predicho: 51, juego: "Juego 10" }
  ];

  const residuosData = realVsPredicted.map(d => ({
    predicho: d.predicho,
    residuo: d.real - d.predicho,
    juego: d.juego
  }));

  const errorDistribution = [
    { rango: "0-5", frecuencia: 4 },
    { rango: "5-10", frecuencia: 3 },
    { rango: "10-15", frecuencia: 2 },
    { rango: "15-20", frecuencia: 1 }
  ];

  // NUEVA GRÁFICA 1: Importancia de Variables (Coeficientes)
  const featureImportance = [
    { variable: "Presupuesto", coeficiente: 0.45, impacto: "Alto" },
    { variable: "Puntuación", coeficiente: 0.38, impacto: "Alto" },
    { variable: "Marketing", coeficiente: 0.32, impacto: "Medio" },
    { variable: "Seguidores", coeficiente: 0.28, impacto: "Medio" },
    { variable: "Plataformas", coeficiente: 0.22, impacto: "Medio" },
    { variable: "Duración", coeficiente: 0.15, impacto: "Bajo" },
    { variable: "Mes lanzamiento", coeficiente: 0.08, impacto: "Bajo" }
  ];

  // NUEVA GRÁFICA 2: Análisis por Género de Juego
  const genreAnalysis = [
    { genero: "Plataforma", ventasPromedio: 52, cantidad: 6 },
    { genero: "Aventura", ventasPromedio: 48, cantidad: 5 },
    { genero: "Puzzle", ventasPromedio: 35, cantidad: 4 },
    { genero: "RPG", ventasPromedio: 61, cantidad: 3 },
    { genero: "Acción", ventasPromedio: 44, cantidad: 2 }
  ];

  // NUEVA GRÁFICA 3: Análisis de Precisión por Rango de Ventas
  const accuracyByRange = [
    { rango: "< 30k", precision: 85, errorPromedio: 3.2 },
    { rango: "30-50k", precision: 78, errorPromedio: 5.8 },
    { rango: "50-70k", precision: 82, errorPromedio: 4.5 },
    { rango: "> 70k", precision: 72, errorPromedio: 8.1 }
  ];

  // Datos para análisis radar comparativo
  const radarData = [
    {
      metrica: "Precisión",
      modelo: 79,
      objetivo: 90
    },
    {
      metrica: "Velocidad",
      modelo: 95,
      objetivo: 85
    },
    {
      metrica: "Interpretabilidad",
      modelo: 88,
      objetivo: 80
    },
    {
      metrica: "Escalabilidad",
      modelo: 70,
      objetivo: 75
    },
    {
      metrica: "Generalización",
      modelo: 76,
      objetivo: 85
    }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2">
            Análisis de Ventas de Videojuegos Indie
          </h1>
          <p className="text-gray-300">
            Sistema de predicción basado en regresión lineal con análisis visual avanzado
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">MAE</span>
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold">{modelMetrics.mae}</div>
            <div className="text-sm opacity-75 mt-1">Error Absoluto Medio</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">RMSE</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold">{modelMetrics.rmse}</div>
            <div className="text-sm opacity-75 mt-1">Raíz Error Cuadrático</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">R²</span>
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold">{(modelMetrics.r2 * 100).toFixed(0)}%</div>
            <div className="text-sm opacity-75 mt-1">Coef. Determinación</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Análisis General' },
              { id: 'importance', label: 'Importancia Variables' },
              { id: 'genre', label: 'Análisis por Género' },
              { id: 'accuracy', label: 'Precisión por Rango' },
              { id: 'comparison', label: 'Radar Comparativo' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de tabs */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Gráfica 1: Real vs Predicho */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Valores Reales vs Predichos
                </h2>
                <p className="text-gray-300 mb-6">
                  Comparación entre las ventas reales y las estimadas por el modelo
                </p>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis 
                      dataKey="real" 
                      name="Ventas Reales"
                      stroke="#fff"
                      label={{ value: 'Ventas Reales (miles)', position: 'insideBottom', offset: -5, fill: '#fff' }}
                    />
                    <YAxis 
                      dataKey="predicho" 
                      name="Ventas Predichas"
                      stroke="#fff"
                      label={{ value: 'Ventas Predichas (miles)', angle: -90, position: 'insideLeft', fill: '#fff' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Scatter data={realVsPredicted} fill="#3b82f6" />
                    <Line 
                      data={[{ real: 20, predicho: 20 }, { real: 80, predicho: 80 }]} 
                      type="monotone" 
                      dataKey="predicho" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfica 2: Residuos */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Gráfico de Residuos
                </h2>
                <p className="text-gray-300 mb-6">
                  Distribución de errores respecto a las predicciones
                </p>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis 
                      dataKey="predicho" 
                      stroke="#fff"
                      label={{ value: 'Ventas Predichas (miles)', position: 'insideBottom', offset: -5, fill: '#fff' }}
                    />
                    <YAxis 
                      stroke="#fff"
                      label={{ value: 'Residuos', angle: -90, position: 'insideLeft', fill: '#fff' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Scatter data={residuosData} fill="#8b5cf6" />
                    <Line 
                      data={[{ predicho: 25, residuo: 0 }, { predicho: 75, residuo: 0 }]} 
                      type="monotone" 
                      dataKey="residuo" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfica 3: Distribución de Errores */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Distribución de Errores Absolutos
                </h2>
                <p className="text-gray-300 mb-6">
                  Frecuencia de errores por rangos de magnitud
                </p>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={errorDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis 
                      dataKey="rango" 
                      stroke="#fff"
                      label={{ value: 'Rango de Error (miles)', position: 'insideBottom', offset: -5, fill: '#fff' }}
                    />
                    <YAxis 
                      stroke="#fff"
                      label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft', fill: '#fff' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    />
                    <Bar dataKey="frecuencia" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'importance' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Importancia de Variables (Coeficientes del Modelo)
              </h2>
              <p className="text-gray-300 mb-6">
                Contribución relativa de cada variable predictora en las ventas estimadas
              </p>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={featureImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis 
                    type="number" 
                    stroke="#fff"
                    label={{ value: 'Coeficiente Normalizado', position: 'insideBottom', offset: -5, fill: '#fff' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="variable" 
                    stroke="#fff"
                    width={120}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  />
                  <Bar dataKey="coeficiente" radius={[0, 8, 8, 0]}>
                    {featureImportance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <div className="text-green-400 font-semibold mb-2">Alto Impacto</div>
                  <div className="text-gray-300 text-sm">
                    Variables con coeficientes &gt; 0.30 tienen influencia significativa
                  </div>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                  <div className="text-yellow-400 font-semibold mb-2">Impacto Medio</div>
                  <div className="text-gray-300 text-sm">
                    Coeficientes entre 0.15 y 0.30 contribuyen moderadamente
                  </div>
                </div>
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <div className="text-red-400 font-semibold mb-2">Bajo Impacto</div>
                  <div className="text-gray-300 text-sm">
                    Coeficientes &lt; 0.15 tienen influencia limitada
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'genre' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Análisis de Ventas por Género
              </h2>
              <p className="text-gray-300 mb-6">
                Comparación del rendimiento comercial según el género del videojuego
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={genreAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis 
                      dataKey="genero" 
                      stroke="#fff"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="#fff"
                      label={{ value: 'Ventas Promedio (miles)', angle: -90, position: 'insideLeft', fill: '#fff' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    />
                    <Bar dataKey="ventasPromedio" radius={[8, 8, 0, 0]}>
                      {genreAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={genreAnalysis}
                      dataKey="cantidad"
                      nameKey="genero"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={(entry) => `${entry.genero}: ${entry.cantidad}`}
                    >
                      {genreAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-2">💡 Insight Clave</div>
                <div className="text-gray-300 text-sm">
                  Los juegos RPG muestran el mayor promedio de ventas (61k), seguidos por juegos de Plataforma (52k). 
                  Los juegos Puzzle tienen el menor rendimiento comercial promedio (35k unidades).
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accuracy' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Precisión del Modelo por Rango de Ventas
              </h2>
              <p className="text-gray-300 mb-6">
                Evaluación del desempeño según diferentes niveles de ventas
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={accuracyByRange}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis 
                    dataKey="rango" 
                    stroke="#fff"
                    label={{ value: 'Rango de Ventas', position: 'insideBottom', offset: -5, fill: '#fff' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#fff"
                    label={{ value: 'Precisión (%)', angle: -90, position: 'insideLeft', fill: '#fff' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#fff"
                    label={{ value: 'Error Promedio', angle: 90, position: 'insideRight', fill: '#fff' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="precision" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Precisión (%)"
                    dot={{ r: 6 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="errorPromedio" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Error Promedio"
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <div className="text-green-400 font-semibold mb-2">✓ Mejor Rendimiento</div>
                  <div className="text-gray-300 text-sm">
                    El modelo alcanza 85% de precisión en juegos con ventas menores a 30k unidades, 
                    con un error promedio de solo 3.2k unidades.
                  </div>
                </div>
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
                  <div className="text-amber-400 font-semibold mb-2">⚠ Área de Mejora</div>
                  <div className="text-gray-300 text-sm">
                    Para juegos con ventas superiores a 70k, la precisión disminuye a 72% 
                    y el error promedio aumenta a 8.1k unidades.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Análisis Radar: Modelo vs Objetivo
              </h2>
              <p className="text-gray-300 mb-6">
                Comparación multidimensional del rendimiento del modelo contra métricas objetivo
              </p>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ffffff30" />
                  <PolarAngleAxis dataKey="metrica" stroke="#fff" />
                  <PolarRadiusAxis stroke="#fff" angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Modelo Actual" 
                    dataKey="modelo" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="Objetivo" 
                    dataKey="objetivo" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Legend />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-6 space-y-3">
                <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
                  <div className="text-purple-400 font-semibold mb-2">📊 Análisis Comparativo</div>
                  <div className="text-gray-300 text-sm space-y-2">
                    <p><strong>Fortalezas:</strong> El modelo supera los objetivos en velocidad (95% vs 85%) 
                    e interpretabilidad (88% vs 80%), siendo ideal para implementación práctica.</p>
                    <p><strong>Oportunidades:</strong> La precisión (79% vs 90%) y generalización (76% vs 85%) 
                    requieren mejoras mediante técnicas de regularización y ampliación del dataset.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer informativo */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">
            📝 Recomendaciones del Análisis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
            <div>
              <strong className="text-white">Para Desarrolladores:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Invertir en marketing y presupuesto de desarrollo</li>
                <li>Priorizar géneros RPG y Plataforma</li>
                <li>Construir comunidad en redes sociales antes del lanzamiento</li>
              </ul>
            </div>
            <div>
              <strong className="text-white">Mejoras del Modelo:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Ampliar dataset con más de 100 muestras</li>
                <li>Explorar modelos no lineales (Random Forest, XGBoost)</li>
                <li>Implementar validación cruzada estratificada</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndieGameSalesAnalysis;