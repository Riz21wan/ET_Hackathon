def get_health_advisory(aqi: float) -> dict:
    if aqi <= 50:
        advice = ("Good", "Outdoor activity is safe.", "No mask required.", "No special warning.")
    elif aqi <= 100:
        advice = ("Moderate", "Sensitive residents should reduce prolonged exertion.", "Basic mask optional near traffic.", "Monitor children and elderly residents.")
    elif aqi <= 200:
        advice = ("Poor", "Limit outdoor exercise during peak traffic hours.", "N95 recommended for sensitive groups.", "Asthma and cardiac patients should keep medication available.")
    elif aqi <= 300:
        advice = ("Very Poor", "Avoid outdoor activity where possible.", "N95 mask recommended outdoors.", "Schools and outdoor workers need exposure controls.")
    else:
        advice = ("Severe", "Stay indoors and use filtration.", "N95 or respirator required outdoors.", "Emergency health alert for all residents.")

    return {
        "aqi": round(aqi, 1),
        "category": advice[0],
        "outdoor_activity_advice": advice[1],
        "mask_recommendation": advice[2],
        "health_warning": advice[3],
    }


def get_recommendations(aqi: float) -> dict:
    recommendations = [
        "Synchronize traffic signals on congestion corridors",
        "Deploy water misting and dust control near construction zones",
        "Increase street sweeping on arterial roads",
    ]
    if aqi > 200:
        recommendations.extend(
            [
                "Increase public transport frequency",
                "Restrict heavy vehicles during peak commute windows",
                "Mandate covered transport of construction material",
            ]
        )
    if aqi > 300:
        recommendations.extend(
            [
                "Activate emergency pollution control measures",
                "Suspend high-dust construction activity",
                "Issue city-wide health alerts",
            ]
        )

    return {"aqi": round(aqi, 1), "recommendations": recommendations}
