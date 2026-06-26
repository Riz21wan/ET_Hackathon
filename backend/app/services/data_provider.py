from __future__ import annotations

from datetime import datetime, timedelta
import math

import numpy as np
import pandas as pd

CITY_CENTER = {"lat": 28.6139, "lng": 77.2090}

WARD_NAMES = [
    "Central Business District",
    "North Industrial Estate",
    "East Residential Belt",
    "South Transit Corridor",
    "West Construction Zone",
    "University Ward",
    "Riverfront Ward",
    "Airport Logistics Zone",
]


def build_integrated_dataframe(hours: int = 240) -> pd.DataFrame:
    now = datetime.now().replace(minute=0, second=0, microsecond=0)
    rows = []
    rng = np.random.default_rng(42)

    for idx in range(hours):
        ts = now - timedelta(hours=hours - idx - 1)
        hour = ts.hour
        commute = 1 if hour in (8, 9, 17, 18, 19) else 0
        weather_cycle = math.sin((idx / 24) * 2 * math.pi)
        traffic_count = 18000 + commute * 9000 + rng.normal(0, 1400)
        pm25 = 48 + commute * 12 + weather_cycle * 8 + rng.normal(0, 5)
        pm10 = 92 + commute * 18 + weather_cycle * 10 + rng.normal(0, 7)
        no2 = 34 + commute * 10 + rng.normal(0, 3)
        so2 = 12 + rng.normal(0, 1.5)
        co = 0.8 + commute * 0.22 + rng.normal(0, 0.06)
        temperature = 29 + weather_cycle * 5 + rng.normal(0, 1.2)
        humidity = 58 - weather_cycle * 12 + rng.normal(0, 3)
        wind_speed = max(1.5, 8 - commute * 1.5 + rng.normal(0, 0.8))
        rainfall = max(0, rng.normal(0.3, 0.9))
        aqi = (
            pm25 * 1.5
            + pm10 * 0.55
            + no2 * 1.15
            + so2 * 0.7
            + co * 18
            + traffic_count * 0.0012
            - wind_speed * 2.4
            - rainfall * 4
        )
        rows.append(
            {
                "timestamp": ts,
                "pm25": round(max(pm25, 5), 2),
                "pm10": round(max(pm10, 10), 2),
                "no2": round(max(no2, 2), 2),
                "so2": round(max(so2, 1), 2),
                "co": round(max(co, 0.1), 2),
                "temperature": round(temperature, 2),
                "humidity": round(max(min(humidity, 95), 10), 2),
                "wind_speed": round(wind_speed, 2),
                "rainfall": round(rainfall, 2),
                "traffic_count": int(max(traffic_count, 1000)),
                "aqi": round(max(aqi, 35), 1),
            }
        )

    return pd.DataFrame(rows)


def aqi_category(aqi: float) -> str:
    if aqi <= 50:
        return "Good"
    if aqi <= 100:
        return "Moderate"
    if aqi <= 200:
        return "Poor"
    if aqi <= 300:
        return "Very Poor"
    return "Severe"


def get_current_aqi() -> dict:
    row = build_integrated_dataframe().iloc[-1].to_dict()
    return {
        "city": "New Delhi Smart Region",
        "timestamp": row["timestamp"].isoformat(),
        "aqi": row["aqi"],
        "category": aqi_category(row["aqi"]),
        "pollutants": {
            "pm25": row["pm25"],
            "pm10": row["pm10"],
            "no2": row["no2"],
            "so2": row["so2"],
            "co": row["co"],
        },
        "weather": {
            "temperature": row["temperature"],
            "humidity": row["humidity"],
            "wind_speed": row["wind_speed"],
            "rainfall": row["rainfall"],
        },
        "traffic": {"vehicle_count": row["traffic_count"], "density": "High" if row["traffic_count"] > 24000 else "Moderate"},
    }


def get_heatmap() -> dict:
    rng = np.random.default_rng(7)
    wards = []
    for idx, name in enumerate(WARD_NAMES):
        angle = (idx / len(WARD_NAMES)) * 2 * math.pi
        lat = CITY_CENTER["lat"] + math.sin(angle) * 0.07
        lng = CITY_CENTER["lng"] + math.cos(angle) * 0.09
        aqi = float(125 + idx * 12 + rng.normal(0, 10))
        co2 = float(80 + idx * 11 + rng.normal(0, 8))
        wards.append(
            {
                "ward": name,
                "lat": round(lat, 5),
                "lng": round(lng, 5),
                "aqi": round(aqi, 1),
                "category": aqi_category(aqi),
                "co2_tons_day": round(co2, 1),
                "risk_score": round(min(100, aqi / 3 + co2 / 2.5), 1),
            }
        )
    return {"center": CITY_CENTER, "wards": wards}


def get_pollution_sources() -> dict:
    return {
        "sources": [
            {"name": "Traffic", "percentage": 42},
            {"name": "Industries", "percentage": 24},
            {"name": "Construction", "percentage": 18},
            {"name": "Residential", "percentage": 16},
        ]
    }
