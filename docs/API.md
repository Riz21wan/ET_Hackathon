# API Documentation

Base URL: `https://aqi-backend-xmkw.onrender.com`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/current-aqi` | Current AQI, pollutants, weather, and traffic snapshot |
| GET | `/api/forecast` | Current AQI, 24/48/72 hour AQI forecast, metrics, trend |
| GET | `/api/emissions` | Daily, monthly, annual CO2 and vehicle-type breakdown |
| GET | `/api/health-advisory` | Outdoor activity, mask, and health warning guidance |
| GET | `/api/recommendations` | AI-generated mitigation recommendations |
| POST | `/api/scenario-analysis` | Scenario impacts from traffic reduction, EV adoption, and trees |
| GET | `/api/heatmap` | Ward-level AQI, CO2, location, and risk data for Leaflet/PostGIS |
| GET | `/api/pollution-sources` | Traffic, industry, construction, residential source attribution |
| POST | `/api/analyze-data` | Analyze manually entered or CSV-imported city observations |

## Scenario Request

```json
{
  "traffic_reduction": 15,
  "ev_adoption": 25,
  "tree_plantation": 10000
}
```

All values are validated by FastAPI:

- `traffic_reduction`: 0 to 50 percent
- `ev_adoption`: 0 to 100 percent
- `tree_plantation`: 0 to 100000 trees

## Database Notes

The prototype ships with a PostGIS-ready schema in `backend/app/db/schema.sql`. Runtime APIs currently use deterministic synthetic data for immediate local demos. For production, connect the service layer to AQI feeds, weather APIs, traffic counters, and PostGIS queries while preserving the route contracts above.

## User Data Analysis Request

Use this endpoint for records entered by hand or imported from CSV/XLSX in the frontend.

```json
{
  "records": [
    {
      "ward": "Central Ward",
      "pm25": 55,
      "pm10": 92,
      "no2": 34,
      "so2": 12,
      "co": 0.8,
      "temperature": 30,
      "humidity": 58,
      "wind_speed": 7,
      "rainfall": 0,
      "traffic_count": 18000,
      "vehicle_type": "car",
      "distance_km": 12,
      "lat": 28.61,
      "lng": 77.2
    }
  ]
}
```

Accepted `vehicle_type` values: `two_wheeler`, `car`, `bus`, `truck`.
