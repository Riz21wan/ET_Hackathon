from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings

app = FastAPI(
    title="AI Urban Air Quality Intelligence Platform",
    description="Smart-city APIs for AQI monitoring, forecasting, emissions, GIS heatmaps, advisories, and scenario simulation.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": app.title}
