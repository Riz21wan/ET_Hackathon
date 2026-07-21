# AI Urban Air Quality Intelligence Platform - VS Code Run Instructions

This guide explains everything you need to install, how to open the project in VS Code, how to run the backend and frontend, and how both parts connect.

## 1. Software You Need To Install

Install these first:

1. Python 3.11 or newer
   - Download: https://www.python.org/downloads/
   - During installation, enable `Add Python to PATH`.

2. Node.js LTS
   - Download: https://nodejs.org/
   - This also installs `npm`.

3. Visual Studio Code
   - Download: https://code.visualstudio.com/

4. Recommended VS Code extensions
   - Python
   - Pylance
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense

Optional:

5. Docker Desktop
   - Download: https://www.docker.com/products/docker-desktop/
   - Needed only if you want to run with Docker/PostgreSQL/PostGIS.

## 2. Open Project In VS Code

Open VS Code.

Go to:

`File > Open Folder`

Select this folder:

```text
C:\Users\Rajabuddeen Ansari\Documents\Codex\2026-06-25\ai-urban-air-quality-intelligence-platform
```

Your project should look like this:

```text
ai-urban-air-quality-intelligence-platform/
  backend/
  frontend/
  docs/
  outputs/
  docker-compose.yml
  README.md
```

## 3. Backend Setup - FastAPI

Open a new VS Code terminal:

`Terminal > New Terminal`

Run:

```powershell
cd backend
```

Install Python dependencies:

```powershell
python -m pip install -r requirements-dev.txt
```

Start backend server:

```powershell
python -m uvicorn app.main:app --reload --port 8000
```

Backend will run here:

```text
http://127.0.0.1:8000
```

API documentation will run here:

```text
http://127.0.0.1:8000/docs
```

Keep this terminal running.

## 4. Frontend Setup - React

Open another VS Code terminal:

`Terminal > New Terminal`

Run:

```powershell
cd frontend
```

Install frontend dependencies:

```powershell
npm.cmd install
```

Start frontend server:

```powershell
npm.cmd run dev
```

Frontend will run here:

```text
http://127.0.0.1:5173
```

Open this URL in your browser.

Important for Windows PowerShell:

Use `npm.cmd` instead of `npm` because your system may block `npm.ps1`.

Correct:

```powershell
npm.cmd install
npm.cmd run dev
```

If you use Command Prompt instead of PowerShell, this may also work:

```cmd
npm install
npm run dev
```

## 5. How Backend And Frontend Connect

The frontend React app calls the backend FastAPI app through this file:

```text
frontend/src/services/api.js
```

It uses:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://aqi-backend-xmkw.onrender.com";
```

That means:

- React runs on `http://127.0.0.1:5173`
- FastAPI runs on `http://127.0.0.1:8000`
- React sends requests to FastAPI endpoints like:

```text
http://127.0.0.1:8000/api/current-aqi
http://127.0.0.1:8000/api/forecast
http://127.0.0.1:8000/api/analyze-data
```

The backend allows frontend access using CORS in:

```text
backend/app/main.py
```

## 6. Main Website Features

Open:

```text
http://127.0.0.1:5173
```

You will see two main tabs:

1. Live dashboard
2. Data workspace

### Live dashboard

Shows:

- Current AQI
- 72 hour AQI forecast
- Carbon emissions
- Pollution risk level
- AQI trend chart
- Forecast chart
- Leaflet GIS heatmap
- Pollution source attribution chart
- Scenario simulation sliders
- Health advisory
- AI recommendations

### Data workspace

Allows you to:

- Fill data manually
- Add multiple data rows
- Upload CSV file
- Download CSV template
- Preview uploaded/manual data
- Analyze your own data
- Generate AQI, CO2, forecast, health advice, recommendations, and map output

## 7. CSV Upload Format

Use this file as your upload template:

```text
outputs/air_quality_import_template.csv
```

Required columns:

```text
ward,pm25,pm10,no2,so2,co,temperature,humidity,wind_speed,rainfall,traffic_count,vehicle_type,distance_km,lat,lng
```

Example:

```csv
ward,pm25,pm10,no2,so2,co,temperature,humidity,wind_speed,rainfall,traffic_count,vehicle_type,distance_km,lat,lng
Central Ward,55,92,34,12,0.8,30,58,7,0,18000,car,12,28.6139,77.209
Industrial Zone,78,130,52,18,1.1,32,50,5,0,26000,truck,18,28.67,77.23
```

Allowed `vehicle_type` values:

```text
two_wheeler
car
bus
truck
```

## 8. Datasets Provided

Dataset files are saved in:

```text
outputs/
```

Files:

```text
outputs/synthetic_aqi_weather_traffic_dataset.csv
outputs/ward_heatmap_dataset.csv
outputs/vehicle_emissions_dataset.csv
outputs/air_quality_import_template.csv
```

Meaning:

- `synthetic_aqi_weather_traffic_dataset.csv`
  - Main AQI, weather, traffic training dataset.

- `ward_heatmap_dataset.csv`
  - Ward-level AQI and CO2 data for GIS map.

- `vehicle_emissions_dataset.csv`
  - Vehicle count, distance, emission factor, CO2 output.

- `air_quality_import_template.csv`
  - Template you can upload in the website.

## 9. Backend API Endpoints

FastAPI docs:

```text
http://127.0.0.1:8000/docs
```

Main endpoints:

```text
GET  /api/current-aqi
GET  /api/forecast
GET  /api/emissions
GET  /api/health-advisory
GET  /api/recommendations
GET  /api/heatmap
GET  /api/pollution-sources
POST /api/scenario-analysis
POST /api/analyze-data
```

## 10. Test The Project

### Backend tests

Open terminal:

```powershell
cd backend
python -m pytest
```

Expected result:

```text
4 passed
```

### Frontend build test

Open terminal:

```powershell
cd frontend
npm.cmd run build
```

Expected result:

```text
built successfully
```

You may see a chunk-size warning. That is okay. It happens because map and chart libraries are large.

## 11. Optional Docker Run

If Docker Desktop is installed, you can run everything together:

```powershell
docker compose up --build
```

This starts:

- PostgreSQL/PostGIS database
- FastAPI backend
- React frontend

URLs:

```text
Frontend: http://127.0.0.1:5173
Backend:  http://127.0.0.1:8000/docs
```

## 12. Important Files To Understand

Backend:

```text
backend/app/main.py
backend/app/api/routes.py
backend/app/services/data_provider.py
backend/app/services/forecast.py
backend/app/services/carbon.py
backend/app/services/scenario.py
backend/app/services/advisory.py
backend/app/services/custom_data.py
backend/app/schemas/requests.py
backend/app/db/schema.sql
```

Frontend:

```text
frontend/src/App.jsx
frontend/src/services/api.js
frontend/src/styles.css
frontend/tailwind.config.js
```

Docs:

```text
README.md
docs/API.md
outputs/VS_CODE_RUN_INSTRUCTIONS.md
```

## 13. Common Problems And Fixes

### Problem: `npm.ps1 cannot be loaded`

Use:

```powershell
npm.cmd install
npm.cmd run dev
```

### Problem: Frontend says API unavailable

Make sure backend is running:

```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

Then refresh:

```text
http://127.0.0.1:5173
```

### Problem: Port already in use

Something is already running on the same port.

For backend, try:

```powershell
python -m uvicorn app.main:app --reload --port 8001
```

Then update frontend API base URL by creating this file:

```text
frontend/.env
```

Add:

```text
VITE_API_BASE_URL=http://127.0.0.1:8001
```

Restart frontend:

```powershell
cd frontend
npm.cmd run dev
```

### Problem: Python package install fails

Upgrade pip:

```powershell
python -m pip install --upgrade pip
```

Then retry:

```powershell
python -m pip install -r requirements-dev.txt
```

## 14. Recommended Run Order

Always run in this order:

1. Open project folder in VS Code.
2. Start backend:

```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

3. Start frontend in another terminal:

```powershell
cd frontend
npm.cmd run dev
```

4. Open:

```text
http://127.0.0.1:5173
```

That is all you need to run and use the project in VS Code.
