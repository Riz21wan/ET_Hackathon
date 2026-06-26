from pydantic import BaseModel, Field


class ScenarioRequest(BaseModel):
    traffic_reduction: float = Field(15, ge=0, le=50)
    ev_adoption: float = Field(25, ge=0, le=100)
    tree_plantation: int = Field(10000, ge=0, le=100000)


class DataRecord(BaseModel):
    ward: str = Field("Manual Entry", min_length=1, max_length=120)
    pm25: float = Field(..., ge=0)
    pm10: float = Field(..., ge=0)
    no2: float = Field(..., ge=0)
    so2: float = Field(..., ge=0)
    co: float = Field(..., ge=0)
    temperature: float = Field(..., ge=-30, le=70)
    humidity: float = Field(..., ge=0, le=100)
    wind_speed: float = Field(..., ge=0)
    rainfall: float = Field(0, ge=0)
    traffic_count: int = Field(..., ge=0)
    vehicle_type: str = Field("car", pattern="^(two_wheeler|car|bus|truck)$")
    distance_km: float = Field(10, ge=0)
    lat: float | None = Field(None, ge=-90, le=90)
    lng: float | None = Field(None, ge=-180, le=180)


class DataAnalysisRequest(BaseModel):
    records: list[DataRecord] = Field(..., min_length=1, max_length=500)
