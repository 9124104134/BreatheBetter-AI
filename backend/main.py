
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(
    title="BreatheBetter AI API",
    description="Urban Air Quality Assistant for healthier daily routines",
    version="1.1.0"
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
    Fetch model-based air-quality data from Open-Meteo.
    Default coordinates represent Chennai, India.
    """

    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "pm2_5,pm10,carbon_monoxide,"
            "nitrogen_dioxide,sulphur_dioxide,ozone"
        ),
        "timezone": "Asia/Kolkata"
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

        current = data.get("current")

        if not current:
            raise HTTPException(
                status_code=502,
                detail="Air-quality data is currently unavailable."
            )

        return {
            "location": "Requested coordinates",
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "timestamp": current.get("time"),
            "data_type": "model_estimate",
            "source": "Open-Meteo Air Quality API (CAMS)",
            "attribution": "Data by Open-Meteo",
            "pollutants": {
                "pm2_5": current.get("pm2_5"),
                "pm10": current.get("pm10"),
                "carbon_monoxide": current.get("carbon_monoxide"),
                "nitrogen_dioxide": current.get("nitrogen_dioxide"),
                "sulphur_dioxide": current.get("sulphur_dioxide"),
                "ozone": current.get("ozone")
            },
            "units": data.get("current_units", {}),
            "note": (
                "These are model-based estimates, not direct "
                "CPCB monitoring-station measurements. "
                "No Indian AQI has been calculated yet."
            )
        }

    except httpx.HTTPError:
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to the air-quality data provider."
        )
