from __future__ import annotations

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

from app.services.data_provider import aqi_category, build_integrated_dataframe

FEATURES = ["pm25", "pm10", "no2", "so2", "co", "temperature", "humidity", "wind_speed", "traffic_count"]


def get_forecast() -> dict:
    df = build_integrated_dataframe()
    x = df[FEATURES]
    y = df["aqi"]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=21)
    model = XGBRegressor(
        objective="reg:squarederror",
        n_estimators=120,
        max_depth=3,
        learning_rate=0.08,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=21,
    )
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)

    latest = df.iloc[-1:].copy()
    forecast_points = []
    for horizon in (24, 48, 72):
        candidate = latest.copy()
        candidate["traffic_count"] *= 1 + horizon / 720
        candidate["pm25"] *= 1 + horizon / 1500
        candidate["pm10"] *= 1 + horizon / 1700
        candidate["wind_speed"] *= max(0.8, 1 - horizon / 1200)
        value = float(model.predict(candidate[FEATURES])[0])
        forecast_points.append({"horizon_hours": horizon, "aqi": round(value, 1), "category": aqi_category(value)})

    trend = df.tail(48)[["timestamp", "aqi", "traffic_count"]].copy()
    trend["timestamp"] = trend["timestamp"].dt.strftime("%H:%M")

    return {
        "current_aqi": round(float(df.iloc[-1]["aqi"]), 1),
        "forecast": forecast_points,
        "metrics": {
            "mae": round(float(mean_absolute_error(y_test, predictions)), 2),
            "rmse": round(float(mean_squared_error(y_test, predictions) ** 0.5), 2),
            "r2": round(float(r2_score(y_test, predictions)), 3),
        },
        "trend": trend.to_dict(orient="records"),
        "model": "XGBoost Regressor",
    }
