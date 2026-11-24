from datetime import datetime
from zoneinfo import ZoneInfo
from math import floor, isfinite

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx


app = FastAPI(
    title="BreatheBetter AI API",
    description="Urban Air Quality Assistant for healthier daily routines",
    version="2.0.0"
)
def calculate_forecast_average(values, start_index, window_size, minimum_values):
    """Calculate an average using upcoming forecast hours."""

    window = values[start_index:start_index + window_size]

    valid_values = []

    for value in window:
        if value is None:
            continue

        try:
            numeric_value = float(value)

            if isfinite(numeric_value) and numeric_value >= 0:
                valid_values.append(numeric_value)

        except (ValueError, TypeError):
            continue

    if len(valid_values) < minimum_values:
        return None

    return sum(valid_values) / len(valid_values)


@app.get("/api/air-quality/forecast")
async def get_air_quality_forecast(
    latitude: float = Query(13.0827, ge=-90, le=90),
    longitude: float = Query(80.2707, ge=-180, le=180)
):
    """
    Return the next 24 hours of forecast air-quality estimates.

    Pollutant sub-indices use forecast-window averages.
    These are model-based forecasts, not official CPCB readings.
    """

    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    pollutants = list(POLLUTANT_NAMES.keys())

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": ",".join(pollutants),
        "forecast_hours": 48,
        "timezone": "Asia/Kolkata"
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

        hourly = data.get("hourly")

        if not hourly or not hourly.get("time"):
            raise HTTPException(
                status_code=502,
                detail="Forecast data is currently unavailable."
            )

        times = hourly.get("time", [])
        forecast = []

        # Return the next 24 hourly forecast periods.
        for index in range(min(24, len(times))):

            pollutant_averages = {}
            sub_indices = {}

            for pollutant in pollutants:

                # CPCB averaging periods:
                # 24 hours for PM2.5, PM10, NO2 and SO2.
                # 8 hours for CO and O3.
                if pollutant in ["carbon_monoxide", "ozone"]:
                    window_size = 8
                    minimum_values = 6
                else:
                    window_size = 24
                    minimum_values = 16

                values = hourly.get(pollutant, [])

                average = calculate_forecast_average(
                    values,
                    index,
                    window_size,
                    minimum_values
                )

                # Convert CO from µg/m³ to mg/m³.
                if pollutant == "carbon_monoxide" and average is not None:
                    average = average / 1000

                pollutant_averages[pollutant] = (
                    round(average, 4)
                    if average is not None
                    else None
                )

                if average is not None:
                    sub_index = calculate_sub_index(
                        pollutant,
                        average
                    )

                    if sub_index is not None:
                        sub_indices[pollutant] = {
                            "name": POLLUTANT_NAMES[pollutant],
                            "average_concentration": round(average, 3),
                            "unit": POLLUTANT_UNITS[pollutant],
                            "sub_index": sub_index,
                            "category": get_aqi_category(sub_index)
                        }

            valid_pollutants = list(sub_indices.keys())

            has_particulate_data = (
                "pm2_5" in valid_pollutants
                or "pm10" in valid_pollutants
            )

            overall_aqi = None
            overall_category = None
            dominant_pollutant = None
            aqi_display = "Insufficient data"

            if len(valid_pollutants) >= 3 and has_particulate_data:

                dominant_key = max(
                    valid_pollutants,
                    key=lambda key: sub_indices[key]["sub_index"]
                )

                overall_aqi = sub_indices[dominant_key]["sub_index"]
                overall_category = get_aqi_category(overall_aqi)
                dominant_pollutant = POLLUTANT_NAMES[dominant_key]

                aqi_display = (
                    "401+"
                    if overall_aqi == 401
                    else str(overall_aqi)
                )

            forecast.append({
                "timestamp": times[index],
                "aqi_estimate": {
                    "aqi": overall_aqi,
                    "aqi_display": aqi_display,
                    "category": overall_category,
                    "dominant_pollutant": dominant_pollutant,
                    "valid_pollutant_count": len(valid_pollutants)
                },
                "pollutant_averages": pollutant_averages,
                "sub_indices": sub_indices
            })

        return {
            "location": "Requested coordinates",
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "data_type": "model_forecast",
            "source": "Open-Meteo Air Quality API (CAMS)",
            "attribution": "Data by Open-Meteo",
            "forecast_period": "Next 24 hours",
            "averaging_method": (
                "Forward forecast-window averages: "
                "24 hours for PM2.5, PM10, NO2 and SO2; "
                "8 hours for CO and O3"
            ),
            "notes": [
                "Forecasts are CAMS model estimates, not official CPCB station readings.",
                "Each timestamp represents a forecast averaging window beginning at that time.",
                "At least three valid pollutants, including PM2.5 or PM10, are required for an overall estimate.",
                "Only six pollutants are included; NH3 and lead are excluded."
            ],
            "forecast": forecast
        }

    except httpx.HTTPError:
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to the air-quality forecast provider."
        )
