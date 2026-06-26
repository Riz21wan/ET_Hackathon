EMISSION_FACTORS_KG_PER_KM = {
    "two_wheeler": 0.072,
    "car": 0.192,
    "bus": 0.822,
    "truck": 1.25,
}

TRAFFIC_MIX = {
    "two_wheeler": {"vehicle_count": 11000, "distance_km": 18},
    "car": {"vehicle_count": 9000, "distance_km": 22},
    "bus": {"vehicle_count": 1600, "distance_km": 36},
    "truck": {"vehicle_count": 1200, "distance_km": 42},
}


def calculate_vehicle_emission(vehicle_count: int, vehicle_type: str, distance_km: float) -> float:
    return vehicle_count * EMISSION_FACTORS_KG_PER_KM[vehicle_type] * distance_km / 1000


def get_emissions() -> dict:
    breakdown = []
    daily_total = 0.0
    for vehicle_type, inputs in TRAFFIC_MIX.items():
        tons = calculate_vehicle_emission(inputs["vehicle_count"], vehicle_type, inputs["distance_km"])
        daily_total += tons
        breakdown.append({"vehicle_type": vehicle_type, "daily_co2_tons": round(tons, 2), **inputs})

    return {
        "daily_co2_tons": round(daily_total, 2),
        "monthly_co2_tons": round(daily_total * 30, 2),
        "annual_co2_tons": round(daily_total * 365, 2),
        "breakdown": breakdown,
    }
