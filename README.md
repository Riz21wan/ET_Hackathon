# 🌍 AI Urban Air Quality Intelligence Platform

> **Predict • Prevent • Protect**

An AI-powered Smart City platform that monitors urban air quality, forecasts pollution levels, estimates carbon emissions, and provides intelligent health advisories and sustainability recommendations.

Built for Government Smart City initiatives and environmental sustainability using **FastAPI, React, Machine Learning, Leaflet Maps, and Recharts**.

---

# 🚀 Live Demo

### 🌐 Frontend (Vercel)

https://et-hackathon-beta.vercel.app

### ⚡ Backend API (Render)

https://et-hackathon-4hli.onrender.com

### 📖 API Documentation

https://et-hackathon-4hli.onrender.com/docs

---

# ✨ Features

## Live Dashboard

- Real-time AQI Monitoring
- Weather Information
- Traffic Analysis
- Carbon Emission Estimation
- Pollution Risk Level
- AI Health Advisory
- Smart Recommendations
- Interactive AQI Charts
- Pollution Source Analysis
- Ward-wise GIS Heatmap

---

## Data Workspace

Users can

- Upload CSV files
- Enter pollution data manually
- Analyze multiple records
- Generate AQI predictions
- Carbon emission reports
- Health advisories
- Sustainability recommendations

---

## AI Capabilities

- AQI Prediction
- Pollution Forecasting
- Carbon Footprint Estimation
- Pollution Source Attribution
- Scenario Simulation
- Smart City Decision Support

---

# 🛠 Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Leaflet
- Recharts
- Axios

## Backend

- FastAPI
- Pydantic
- NumPy
- Pandas
- Scikit-learn
- XGBoost
- Uvicorn

## Database

- PostgreSQL
- PostGIS (Docker)

## Deployment

- Vercel
- Render
- Docker

---

# 📂 Project Structure

```
backend/
│
├── app/
│   ├── api/
│   ├── services/
│   ├── schemas/
│   ├── db/
│   └── core/
│
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── assets/
│
docker-compose.yml
README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Riz21wan/ai-urban-AQI-monitoring-.git
cd ai-urban-AQI-monitoring-
```

---

# Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

Backend runs at

```
http://127.0.0.1:8000
```

API Docs

```
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at

```
http://127.0.0.1:5173
```

---

# Environment Variables

Frontend

```
VITE_API_BASE_URL=https://et-hackathon-4hli.onrender.com
```

Backend

```
DATABASE_URL=postgresql://...
```

---

# Docker

Run the complete application

```bash
docker compose up --build
```

Services

| Service | URL |
|---------|------|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |

---

# API Endpoints

| Method | Endpoint |
|---------|----------|
| GET | /api/current-aqi |
| GET | /api/forecast |
| GET | /api/emissions |
| GET | /api/health-advisory |
| GET | /api/recommendations |
| GET | /api/heatmap |
| GET | /api/pollution-sources |
| POST | /api/scenario-analysis |
| POST | /api/analyze-data |

---

# Screens

- Smart City Dashboard
- AQI Forecast
- Carbon Emission Analytics
- GIS Heatmap
- Health Advisory
- Scenario Simulator
- CSV Analysis Workspace

---

# Future Enhancements

- Live CPCB AQI Integration
- OpenWeather API
- Google Traffic API
- Satellite Data Integration
- IoT Sensor Support
- AI Chat Assistant
- Government Dashboard
- Mobile Application

---

# Deployment

Frontend

- Vercel

Backend

- Render

Database

- PostgreSQL + PostGIS

---

# License

This project is developed for educational purposes, hackathons, and Smart City innovation initiatives.

---

## 👨‍💻 Author

**Rizwan Ansari**

B.Tech CSE (AI & ML)

GitHub

https://github.com/Riz21wan
