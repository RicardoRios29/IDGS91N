-- ====== DIMENSIONES ======
-- Dimensión de Tiempo
CREATE TABLE Dim_Tiempo (
    id_tiempo SERIAL PRIMARY KEY,
    year_month VARCHAR(7) NOT NULL,         
    month_of_release VARCHAR(10) NULL
);

-- Dimensión de País
CREATE TABLE Dim_Pais (
    id_pais SERIAL PRIMARY KEY,
    country_of_residence VARCHAR(100) NOT NULL
);

-- Dimensión de Ciudadanía
CREATE TABLE Dim_Ciudadania (
    id_ciudadania SERIAL PRIMARY KEY,
    citizenship VARCHAR(50) NOT NULL
);

-- Dimensión de Tipo de Visa
CREATE TABLE Dim_Visa (
    id_visa SERIAL PRIMARY KEY,
    visa VARCHAR(100) NOT NULL
);

-- Dimensión de Tipo de Pasajero
CREATE TABLE Dim_Pasajero (
    id_tipo_pasajero SERIAL PRIMARY KEY,
    passenger_type VARCHAR(100) NOT NULL
);

-- Dimensión de Dirección del flujo migratorio
CREATE TABLE Dim_Direccion (
    id_direccion SERIAL PRIMARY KEY,
    direction VARCHAR(20) NOT NULL  -- Ej: 'Arrivals', 'Departures'
);

-- ====== TABLA DE HECHOS ======

CREATE TABLE Hechos_Migracion (
    id_hecho SERIAL PRIMARY KEY,

    -- Claves foráneas hacia las dimensiones
    id_tiempo INT NOT NULL,
    id_pais INT NOT NULL,
    id_ciudadania INT NOT NULL,
    id_visa INT NOT NULL,
    id_tipo_pasajero INT NOT NULL,
    id_direccion INT NOT NULL,

    -- Medidas
    estimate INT NOT NULL,
    standard_error INT,
    status VARCHAR(50),

    -- Relaciones
    FOREIGN KEY (id_tiempo) REFERENCES Dim_Tiempo(id_tiempo),
    FOREIGN KEY (id_pais) REFERENCES Dim_Pais(id_pais),
    FOREIGN KEY (id_ciudadania) REFERENCES Dim_Ciudadania(id_ciudadania),
    FOREIGN KEY (id_visa) REFERENCES Dim_Visa(id_visa),
    FOREIGN KEY (id_tipo_pasajero) REFERENCES Dim_Pasajero(id_tipo_pasajero),
    FOREIGN KEY (id_direccion) REFERENCES Dim_Direccion(id_direccion)
);

-- ====== VISTAS DE CONSULTA ======
CREATE VIEW vw_Migracion_Completa AS
SELECT
    h.id_hecho,
    t.year_month,
    t.month_of_release,
    p.country_of_residence,
    c.citizenship,
    v.visa,
    pa.passenger_type,
    d.direction,
    h.estimate,
    h.standard_error,
    h.status
FROM Hechos_Migracion h
JOIN Dim_Tiempo t ON h.id_tiempo = t.id_tiempo
JOIN Dim_Pais p ON h.id_pais = p.id_pais
JOIN Dim_Ciudadania c ON h.id_ciudadania = c.id_ciudadania
JOIN Dim_Visa v ON h.id_visa = v.id_visa
JOIN Dim_Pasajero pa ON h.id_tipo_pasajero = pa.id_tipo_pasajero
JOIN Dim_Direccion d ON h.id_direccion = d.id_direccion;