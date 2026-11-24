
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://breathe-better-ai-frontend.vercel.app",
        "https://breathe-better-ai-frontend-dha7rl8qz-sai-shruthi-v.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


TIMEZONE = ZoneInfo("Asia/Kolkata")

# CPCB concentration breakpoints and corresponding AQI ranges.
# Concentrations are in micrograms/m3, except CO (mg/m3).
AQI_BREAKPOINTS = {
    "pm2_5": [
        (0, 30, 0, 50),
        (31, 60, 51, 100),
        (61, 90, 101, 200),
        (91, 120, 201, 300),
        (121, 250, 301, 400),
    ],
    "pm10": [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 250, 101, 200),
        (251, 350, 201, 300),
        (351, 430, 301, 400),
    ],
    "nitrogen_dioxide": [
        (0, 40, 0, 50),
        (41, 80, 51, 100),
        (81, 180, 101, 200),
        (181, 280, 201, 300),
        (281, 400, 301, 400),
    ],
    "sulphur_dioxide": [
        (0, 40, 0, 50),
        (41, 80, 51, 100),
        (81, 380, 101, 200),
        (381, 800, 201, 300),
        (801, 1600, 301, 400),
    ],
    "carbon_monoxide": [
        (0.0, 1.0, 0, 50),
        (1.1, 2.0, 51, 100),
        (2.1, 10.0, 101, 200),
        (10.1, 17.0, 201, 300),
        (17.1, 34.0, 301, 400),
    ],
    "ozone": [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 168, 101, 200),
        (169, 208, 201, 300),
        (209, 748, 301, 400),
    ],
}

# The published CPCB table gives an open-ended Severe band.
# We report 401+ rather than inventing an upper concentration
# breakpoint or extrapolating an unsupported exact sub-index.
SEVERE_THRESHOLDS = {
    "pm2_5": 250,
    "pm10": 430,
    "nitrogen_dioxide": 400,
    "sulphur_dioxide": 1600,
    "carbon_monoxide": 34.0,
    "ozone": 748,
}

POLLUTANT_NAMES = {
    "pm2_5": "PM2.5",
    "pm10": "PM10",
    "carbon_monoxide": "Carbon Monoxide",
    "nitrogen_dioxide": "Nitrogen Dioxide",
    "sulphur_dioxide": "Sulphur Dioxide",
    "ozone": "Ozone",
}

POLLUTANT_UNITS = {
    "pm2_5": "µg/m³",
    "pm10": "µg/m³",
    "carbon_monoxide": "mg/m³",
    "nitrogen_dioxide": "µg/m³",
    "sulphur_dioxide": "µg/m³",
    "ozone": "µg/m³",
}


def get_aqi_category(aqi):
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Satisfactory"
    elif aqi <= 200:
        return "Moderate"
    elif aqi <= 300:
        return "Poor"
    elif aqi <= 400:
        return "Very Poor"
    return "Severe"


def calculate_sub_index(pollutant, concentration):
    """
    Calculate an approximate CPCB-breakpoint sub-index.

    Concentrations are truncated to the precision used by
    the breakpoint table before interpolation.
    """

    if concentration is None or not isfinite(concentration):
        return None

    if concentration < 0:
        return None

    if pollutant == "carbon_monoxide":
        concentration = floor(concentration * 10) / 10
    else:
        concentration = floor(concentration)

    # The Severe category has an open-ended concentration range.
    if concentration >= SEVERE_THRESHOLDS[pollutant]:
        return 401

    for c_low, c_high, i_low, i_high in AQI_BREAKPOINTS[pollutant]:
        if c_low <= concentration <= c_high:
            if c_high == c_low:
                return i_low

            sub_index = (
                (i_high - i_low)
                / (c_high - c_low)
                * (concentration - c_low)
                + i_low
            )

            return round(sub_index)

    return None


def get_hourly_average(
    hourly_data,
    pollutant,
    window_size,
    minimum_values
):
    """
    Calculate an average from the latest hourly observations
    that are not in the future.

    24-hour pollutants: require at least 16 valid observations.
    8-hour pollutants: require at least 6 valid observations.
    """

    times = hourly_data.get("time", [])
    values = hourly_data.get(pollutant, [])

    now = datetime.now(TIMEZONE)
    observations = []

    for timestamp, value in zip(times, values):
        if value is None:
            continue

        try:
            observation_time = datetime.fromisoformat(
                timestamp.replace("Z", "+00:00")
            )

            if observation_time.tzinfo is None:
                observation_time = observation_time.replace(
                    tzinfo=TIMEZONE
                )

            if observation_time <= now:
                observations.append((observation_time, float(value)))

        except (ValueError, TypeError):
            continue

    observations.sort(key=lambda item: item[0])

    # Take only the latest requested time window.
    observations = observations[-window_size:]

    valid_values = [
        value
        for _, value in observations
        if isfinite(value) and value >= 0
    ]

    if len(valid_values) < minimum_values:
        return {
            "average": None,
            "valid_hours": len(valid_values),
            "required_hours": minimum_values,
            "window_hours": window_size,
        }

    average = sum(valid_values) / len(valid_values)

    return {
        "average": round(average, 3),
        "valid_hours": len(valid_values),
        "required_hours": minimum_values,
        "window_hours": window_size,
    }


@app.get("/")
def home():
    return {
        "message": "Welcome to BreatheBetter AI",
        "status": "Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BreatheBetter AI API"
    }


@app.get("/api/air-quality")
async def get_air_quality(
    latitude: float = Query(13.0827, ge=-90, le=90),
    longitude: float = Query(80.2707, ge=-180, le=180)
):
    """
    Fetch current and hourly model-based pollutant data
    and calculate an approximate CPCB-breakpoint AQI.

    IMPORTANT:
    This is not an official CPCB monitoring-station AQI.
    """

    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    pollutants = list(POLLUTANT_NAMES.keys())

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ",".join(pollutants),
        "hourly": ",".join(pollutants),
        "past_hours": 25,
        "forecast_hours": 1,
        "timezone": "Asia/Kolkata"
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

        current = data.get("current")
        hourly = data.get("hourly")

        if not current or not hourly:
            raise HTTPException(
                status_code=502,
                detail="Air-quality data is currently unavailable."
            )

        # Current pollutant concentrations.
        current_pollutants = {}

        for pollutant in pollutants:
            current_pollutants[pollutant] = current.get(pollutant)

        # Calculate running averages and pollutant sub-indices.
        pollutant_averages = {}
        sub_indices = {}
        data_coverage = {}

        for pollutant in pollutants:

            # CPCB uses 24-hour averages for particulate matter,
            # NO2 and SO2; 8-hour averages for CO and O3.
            if pollutant in ["carbon_monoxide", "ozone"]:
                window_size = 8
                minimum_values = 6
            else:
                window_size = 24
                minimum_values = 16

            result = get_hourly_average(
                hourly,
                pollutant,
                window_size,
                minimum_values
            )

            average = result["average"]

            # Open-Meteo returns CO in µg/m³.
            # CPCB CO breakpoints use mg/m³.
            if pollutant == "carbon_monoxide" and average is not None:
                average = average / 1000

            pollutant_averages[pollutant] = (
                round(average, 4) if average is not None else None
            )

            data_coverage[pollutant] = {
                "valid_hours": result["valid_hours"],
                "required_hours": result["required_hours"],
                "window_hours": result["window_hours"],
                "sufficient": average is not None
            }

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

        # CPCB requires at least three pollutants, including
        # PM2.5 or PM10, for an overall AQI.
        valid_pollutants = list(sub_indices.keys())

        has_particulate_data = (
            "pm2_5" in valid_pollutants
            or "pm10" in valid_pollutants
        )

        enough_pollutants = len(valid_pollutants) >= 3

        overall_aqi = None
        overall_category = None
        dominant_pollutant = None
        aqi_display = None

        if enough_pollutants and has_particulate_data:

            dominant_key = max(
                valid_pollutants,
                key=lambda key: sub_indices[key]["sub_index"]
            )

            overall_aqi = sub_indices[dominant_key]["sub_index"]
            overall_category = get_aqi_category(overall_aqi)
            dominant_pollutant = POLLUTANT_NAMES[dominant_key]

            # 401 is the minimum Severe index. The exact value
            # is not extrapolated beyond the open-ended CPCB band.
            if overall_aqi == 401:
                aqi_display = "401+"
            else:
                aqi_display = str(overall_aqi)

        else:
            aqi_display = "Insufficient data"

        return {
            "location": "Requested coordinates",
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "timestamp": current.get("time"),

            "data_type": "model_estimate",
            "source": "Open-Meteo Air Quality API (CAMS)",
            "attribution": "Data by Open-Meteo",

            "current_pollutants": current_pollutants,

            "pollutant_averages": pollutant_averages,

            "sub_indices": sub_indices,

            "aqi_estimate": {
                "aqi": overall_aqi,
                "aqi_display": aqi_display,
                "category": overall_category,
                "dominant_pollutant": dominant_pollutant,
                "valid_pollutant_count": len(valid_pollutants),
                "minimum_pollutants_required": 3,
                "particulate_data_available": has_particulate_data,
                "calculation_method": "CPCB breakpoint interpolation"
            },

            "data_coverage": data_coverage,

            "notes": [
                "This is a model-based AQI estimate, not an official CPCB AQI.",
                "Open-Meteo pollutant concentrations are CAMS model estimates, not direct CPCB station measurements.",
                "PM2.5, PM10, NO2 and SO2 use 24-hour averaging windows.",
                "CO and O3 use 8-hour averaging windows.",
                "At least three valid pollutants, including PM2.5 or PM10, are required for an overall AQI.",
                "The CPCB Severe concentration bands are open-ended. A value of 401+ is reported without unsupported extrapolation.",
                "This implementation uses only six pollutants. NH3 and lead are not included."
            ]
        }

    except httpx.HTTPError:
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to the air-quality data provider."
        )
