CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'analyst',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aqi_data (
  id SERIAL PRIMARY KEY,
  ward TEXT NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  aqi NUMERIC NOT NULL,
  pm25 NUMERIC,
  pm10 NUMERIC,
  no2 NUMERIC,
  so2 NUMERIC,
  co NUMERIC,
  geom GEOGRAPHY(POINT, 4326)
);

CREATE TABLE IF NOT EXISTS weather_data (
  id SERIAL PRIMARY KEY,
  ward TEXT NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  temperature NUMERIC,
  humidity NUMERIC,
  wind_speed NUMERIC,
  rainfall NUMERIC
);

CREATE TABLE IF NOT EXISTS traffic_data (
  id SERIAL PRIMARY KEY,
  ward TEXT NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  vehicle_count INTEGER,
  traffic_density TEXT,
  geom GEOGRAPHY(POINT, 4326)
);

CREATE TABLE IF NOT EXISTS carbon_emissions (
  id SERIAL PRIMARY KEY,
  ward TEXT NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  vehicle_type TEXT NOT NULL,
  vehicle_count INTEGER NOT NULL,
  distance_km NUMERIC NOT NULL,
  co2_tons NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  horizon_hours INTEGER NOT NULL,
  predicted_aqi NUMERIC NOT NULL,
  model_name TEXT NOT NULL,
  metrics JSONB
);

CREATE TABLE IF NOT EXISTS health_advisories (
  id SERIAL PRIMARY KEY,
  aqi_min INTEGER NOT NULL,
  aqi_max INTEGER,
  category TEXT NOT NULL,
  outdoor_activity_advice TEXT NOT NULL,
  mask_recommendation TEXT NOT NULL,
  health_warning TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scenario_results (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  traffic_reduction NUMERIC NOT NULL,
  ev_adoption NUMERIC NOT NULL,
  tree_plantation INTEGER NOT NULL,
  projected_aqi NUMERIC NOT NULL,
  projected_co2_tons NUMERIC NOT NULL,
  impact JSONB NOT NULL
);
