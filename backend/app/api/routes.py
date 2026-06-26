from fastapi import APIRouter

from app.schemas.requests import DataAnalysisRequest, ScenarioRequest
from app.services.advisory import get_health_advisory, get_recommendations
from app.services.carbon import get_emissions
from app.services.custom_data import analyze_user_data
from app.services.data_provider import get_current_aqi, get_heatmap, get_pollution_sources
from app.services.forecast import get_forecast
from app.services.scenario import run_scenario

router = APIRouter(tags=["air-quality"])


@router.get("/current-aqi")
def current_aqi():
    return get_current_aqi()


@router.get("/forecast")
def forecast():
    return get_forecast()


@router.get("/emissions")
def emissions():
    return get_emissions()


@router.get("/health-advisory")
def health_advisory():
    return get_health_advisory(get_current_aqi()["aqi"])


@router.get("/recommendations")
def recommendations():
    return get_recommendations(get_current_aqi()["aqi"])


@router.post("/scenario-analysis")
def scenario_analysis(payload: ScenarioRequest):
    return run_scenario(payload)


@router.get("/heatmap")
def heatmap():
    return get_heatmap()


@router.get("/pollution-sources")
def pollution_sources():
    return get_pollution_sources()


@router.post("/analyze-data")
def analyze_data(payload: DataAnalysisRequest):
    return analyze_user_data(payload)
