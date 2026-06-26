# AI Urban Air Quality Intelligence Platform

Full-stack smart-city prototype for monitoring, forecasting, and reducing urban air pollution with FastAPI, React, Leaflet, Recharts, and ML-oriented Python services.

## Features

- Current AQI, pollutant, weather, traffic, and carbon emission APIs
- 24/48/72 hour AQI forecast with regression metrics
- Carbon emission calculator and scenario simulation
- Pollution source attribution
- Health advisories and AI policy recommendations
- GIS-ready ward heatmap payloads for Leaflet/PostGIS workflows
- Responsive smart-city operations dashboard
- Docker Compose setup with PostgreSQL + PostGIS

## Quick Start

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Dashboard: http://localhost:5173

## Docker

```powershell
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- PostgreSQL/PostGIS: localhost:5432

## Project Structure

```text
backend/
  app/
    api/              REST route modules
    core/             settings
    db/               schema and seed SQL
    schemas/          Pydantic response models
    services/         data, prediction, scenario, advisory logic
frontend/
  src/
    components/       Dashboard widgets
    services/         API client
    types.js          Shared JS shape documentation
docker-compose.yml
```

The default implementation uses deterministic synthetic city data so the platform runs immediately. The database schema and API service boundaries are ready for swapping in real AQI, weather, traffic, satellite, or PostGIS-backed providers.
