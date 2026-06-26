from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_current_aqi_contract():
    response = client.get("/api/current-aqi")
    assert response.status_code == 200
    payload = response.json()
    assert payload["aqi"] > 0
    assert "pollutants" in payload
    assert "weather" in payload


def test_forecast_contract():
    response = client.get("/api/forecast")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload["forecast"]) == 3
    assert payload["metrics"]["rmse"] >= 0


def test_scenario_analysis_improves_baseline():
    response = client.post(
        "/api/scenario-analysis",
        json={"traffic_reduction": 15, "ev_adoption": 50, "tree_plantation": 25000},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["projected"]["aqi"] < payload["baseline"]["aqi"]
    assert payload["impact"]["co2_reduction_tons_day"] > 0


def test_user_data_analysis_contract():
    response = client.post(
        "/api/analyze-data",
        json={
            "records": [
                {
                    "ward": "Test Ward",
                    "pm25": 55,
                    "pm10": 90,
                    "no2": 35,
                    "so2": 12,
                    "co": 0.8,
                    "temperature": 30,
                    "humidity": 55,
                    "wind_speed": 7,
                    "rainfall": 0,
                    "traffic_count": 18000,
                    "vehicle_type": "car",
                    "distance_km": 12,
                    "lat": 28.61,
                    "lng": 77.2,
                }
            ]
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["summary"]["records"] == 1
    assert payload["summary"]["average_aqi"] > 0
    assert len(payload["forecast"]) == 3
