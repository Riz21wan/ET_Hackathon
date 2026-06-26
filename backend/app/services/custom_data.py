from statistics import mean

from app.schemas.requests import DataAnalysisRequest, DataRecord
from app.services.advisory import get_health_advisory, get_recommendations
from app.services.carbon import EMISSION_FACTORS_KG_PER_KM
from app.services.data_provider import CITY_CENTER, aqi_category


def estimate_aqi(record: DataRecord) -> float:
    aqi = (
        record.pm25 * 1.52
        + record.pm10 * 0.54
        + record.no2 * 1.12
        + record.so2 * 0.7
        + record.co * 18
        + record.traffic_count * 0.00115
        - record.wind_speed * 2.25
        - record.rainfall * 3.8
    )
    return round(max(0, aqi), 1)


def analyze_user_data(payload: DataAnalysisRequest) -> dict:
    rows = []
    for index, record in enumerate(payload.records):
        aqi = estimate_aqi(record)
        emission_factor = EMISSION_FACTORS_KG_PER_KM[record.vehicle_type]
        co2_tons = record.traffic_count * emission_factor * record.distance_km / 1000
        rows.append(
            {
                **record.model_dump(),
                "id": index + 1,
                "aqi": aqi,
                "category": aqi_category(aqi),
                "co2_tons": round(co2_tons, 2),
            }
        )

    average_aqi = round(mean(row["aqi"] for row in rows), 1)
    total_co2 = round(sum(row["co2_tons"] for row in rows), 2)
    worst = max(rows, key=lambda row: row["aqi"])
    advisory = get_health_advisory(average_aqi)
    recommendations = get_recommendations(average_aqi)

    forecast = []
    for horizon, drift in ((24, 1.03), (48, 1.06), (72, 1.09)):
        value = round(average_aqi * drift, 1)
        forecast.append({"horizon_hours": horizon, "aqi": value, "category": aqi_category(value)})

    heatmap = []
    for index, row in enumerate(rows):
        heatmap.append(
            {
                "ward": row["ward"],
                "lat": row["lat"] if row["lat"] is not None else CITY_CENTER["lat"] + index * 0.012,
                "lng": row["lng"] if row["lng"] is not None else CITY_CENTER["lng"] + index * 0.012,
                "aqi": row["aqi"],
                "category": row["category"],
                "co2_tons_day": row["co2_tons"],
                "risk_score": round(min(100, row["aqi"] / 3 + row["co2_tons"] / 2.5), 1),
            }
        )

    return {
        "summary": {
            "records": len(rows),
            "average_aqi": average_aqi,
            "category": aqi_category(average_aqi),
            "total_co2_tons": total_co2,
            "worst_ward": worst["ward"],
            "worst_aqi": worst["aqi"],
        },
        "forecast": forecast,
        "advisory": advisory,
        "recommendations": recommendations,
        "rows": rows,
        "heatmap": {"center": CITY_CENTER, "wards": heatmap},
    }
