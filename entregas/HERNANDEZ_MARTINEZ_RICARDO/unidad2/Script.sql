-- - Los datos originales se cargan en una tabla staging_raw (texto tal cual).
-- - Transformaciones/normalizaciones se hacen en staging_clean y luego se llenan dims y facts.

-- 1) Tabla de staging (raw)
CREATE TABLE staging_raw_migration (
    raw_id        BIGSERIAL PRIMARY KEY,
    year_month    TEXT,
    month_of_release TEXT,
    passenger_type TEXT,
    direction     TEXT,
    citizenship   TEXT,
    visa          TEXT,
    country_of_residence TEXT,
    estimate      BIGINT,
    standard_error DOUBLE PRECISION,
    status        TEXT,
    source_file   TEXT,
    load_ts       TIMESTAMP DEFAULT now()
);

-- 2) Tabla staging limpia (normaliza tipos y marca problemas)
CREATE TABLE staging_clean_migration AS
SELECT
    raw_id,
    -- normalize year_month to date (first day of month)
    to_date(year_month || '-01','YYYY-MM-DD') AS ym_date,
    to_date(month_of_release || '-01', 'YYYY-MM-DD') AS release_date,
    nullif(trim(passenger_type),'') AS passenger_type,
    nullif(trim(direction),'') AS direction,
    nullif(trim(citizenship),'') AS citizenship,
    nullif(trim(visa),'') AS visa,
    nullif(trim(country_of_residence),'') AS country_of_residence,
    CASE WHEN estimate IS NULL THEN NULL ELSE estimate END AS estimate,
    CASE WHEN standard_error IS NULL THEN NULL ELSE standard_error END AS standard_error,
    nullif(trim(status),'') AS status,
    source_file,
    load_ts
FROM staging_raw_migration
WHERE coalesce(year_month,'') <> ''
-- keep only rows with a valid period
;

-- 3) Dimensiones básicas

CREATE TABLE dim_date (
    date_id SERIAL PRIMARY KEY,
    month_start_date DATE NOT NULL UNIQUE, -- business key YYYY-MM-01
    year  INT NOT NULL,
    month INT NOT NULL,
    quarter INT NOT NULL,
    year_month VARCHAR(7) NOT NULL UNIQUE  -- 'YYYY-MM'
);

CREATE TABLE dim_release_date (
    release_date_id SERIAL PRIMARY KEY,
    month_start_date DATE NOT NULL UNIQUE,
    year INT NOT NULL,
    month INT NOT NULL,
    year_month VARCHAR(7) NOT NULL UNIQUE
);

CREATE TABLE dim_passenger_type (
    passenger_type_id SERIAL PRIMARY KEY,
    passenger_type_code TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE dim_direction (
    direction_id SERIAL PRIMARY KEY,
    direction_code TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE dim_country (
    country_id SERIAL PRIMARY KEY,
    country_name TEXT NOT NULL,
    iso_alpha2 CHAR(2),
    iso_alpha3 CHAR(3),
    UNIQUE(country_name)
);

CREATE TABLE dim_visa (
    visa_id SERIAL PRIMARY KEY,
    visa_code TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE dim_status (
    status_id SERIAL PRIMARY KEY,
    status_code TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 4) Población de dimensiones desde staging_clean (ejemplo)
-- A) dim_date
INSERT INTO dim_date (month_start_date, year, month, quarter, year_month)
SELECT DISTINCT
    ym_date::date AS month_start_date,
    EXTRACT(YEAR FROM ym_date)::int AS year,
    EXTRACT(MONTH FROM ym_date)::int AS month,
    EXTRACT(QUARTER FROM ym_date)::int AS quarter,
    to_char(ym_date,'YYYY-MM') AS year_month
FROM staging_clean_migration
WHERE ym_date IS NOT NULL
ON CONFLICT (month_start_date) DO NOTHING;

-- B) dim_release_date
INSERT INTO dim_release_date (month_start_date, year, month, year_month)
SELECT DISTINCT
    release_date::date AS month_start_date,
    EXTRACT(YEAR FROM release_date)::int,
    EXTRACT(MONTH FROM release_date)::int,
    to_char(release_date,'YYYY-MM')
FROM staging_clean_migration
WHERE release_date IS NOT NULL
ON CONFLICT (month_start_date) DO NOTHING;

-- C) dim_passenger_type
INSERT INTO dim_passenger_type (passenger_type_code)
SELECT DISTINCT passenger_type
FROM staging_clean_migration
WHERE passenger_type IS NOT NULL
ON CONFLICT (passenger_type_code) DO NOTHING;

-- D) dim_direction
INSERT INTO dim_direction (direction_code)
SELECT DISTINCT direction
FROM staging_clean_migration
WHERE direction IS NOT NULL
ON CONFLICT (direction_code) DO NOTHING;

-- E) dim_country (unificada para citizenship y residence)
INSERT INTO dim_country (country_name)
SELECT DISTINCT citizenship FROM staging_clean_migration WHERE citizenship IS NOT NULL
ON CONFLICT (country_name) DO NOTHING;

INSERT INTO dim_country (country_name)
SELECT DISTINCT country_of_residence FROM staging_clean_migration WHERE country_of_residence IS NOT NULL
ON CONFLICT (country_name) DO NOTHING;

-- F) dim_visa
INSERT INTO dim_visa (visa_code)
SELECT DISTINCT visa FROM staging_clean_migration WHERE visa IS NOT NULL
ON CONFLICT (visa_code) DO NOTHING;

-- G) dim_status
INSERT INTO dim_status (status_code)
SELECT DISTINCT status FROM staging_clean_migration WHERE status IS NOT NULL
ON CONFLICT (status_code) DO NOTHING;

-- 5) Crear tabla de hechos
CREATE TABLE fact_migration_monthly (
    fact_id BIGSERIAL PRIMARY KEY,
    date_id INT NOT NULL REFERENCES dim_date(date_id),
    release_date_id INT REFERENCES dim_release_date(release_date_id),
    passenger_type_id INT REFERENCES dim_passenger_type(passenger_type_id),
    direction_id INT REFERENCES dim_direction(direction_id),
    citizenship_country_id INT REFERENCES dim_country(country_id),
    residence_country_id INT REFERENCES dim_country(country_id),
    visa_id INT REFERENCES dim_visa(visa_id),
    status_id INT REFERENCES dim_status(status_id),
    estimate BIGINT, -- sum of estimates
    standard_error DOUBLE PRECISION, -- combined SE: sqrt(sum(se^2))
    source_row_count INT DEFAULT 1,
    load_ts TIMESTAMP DEFAULT now(),
    source_file TEXT,
    source_row_hash TEXT
);
