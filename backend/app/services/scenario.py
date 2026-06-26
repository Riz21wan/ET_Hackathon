from app.schemas.requests import ScenarioRequest
from app.services.carbon import get_emissions
from app.services.data_provider import get_current_aqi, aqi_category


def run_scenario(payload: ScenarioRequest) -> dict:
    current = get_current_aqi()
    baseline_aqi = current["aqi"]
    baseline_co2 = get_emissions()["daily_co2_tons"]

    aqi_improvement_pct = min(
        42,
        payload.traffic_reduction * 0.65 + payload.ev_adoption * 0.12 + payload.tree_plantation / 100000 * 7,
    )
    co2_reduction_pct = min(
        65,
        payload.traffic_reduction * 0.75 + payload.ev_adoption * 0.36 + payload.tree_plantation / 100000 * 4,
    )

    projected_aqi = baseline_aqi * (1 - aqi_improvement_pct / 100)
    projected_co2 = baseline_co2 * (1 - co2_reduction_pct / 100)

    return {
        "inputs": payload.model_dump(),
        "baseline": {"aqi": baseline_aqi, "daily_co2_tons": baseline_co2},
        "projected": {
            "aqi": round(projected_aqi, 1),
            "category": aqi_category(projected_aqi),
            "daily_co2_tons": round(projected_co2, 2),
        },
        "impact": {
            "aqi_improvement_percent": round(aqi_improvement_pct, 1),
            "co2_reduction_percent": round(co2_reduction_pct, 1),
            "co2_reduction_tons_day": round(baseline_co2 - projected_co2, 2),
            "pollution_reduction_percent": round((aqi_improvement_pct + co2_reduction_pct) / 2, 1),
        },
    }
