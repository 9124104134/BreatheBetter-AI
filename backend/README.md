# BreatheBetter AI – Backend

## 1. Overview

The BreatheBetter AI backend is developed using Python and FastAPI. It provides REST API endpoints to retrieve and process air-quality information and deliver structured responses to the frontend dashboard.

The backend integrates with the Open-Meteo Air Quality API, using CAMS model data to calculate current AQI estimates and provide air-quality forecasts.

## 2. Technology Stack

- **Python** – Backend programming language.
- **FastAPI** – REST API framework.
- **Uvicorn** – ASGI server.
- **Open-Meteo Air Quality API** – External air-quality data source.
- **CORS Middleware** – Enables communication between the frontend and backend.

## 3. Features

- Current air-quality data retrieval.
- Pollutant concentration processing.
- CPCB-style AQI calculation.
- Individual pollutant sub-index calculation.
- AQI category classification.
- 24-hour air-quality forecasting.
- Structured JSON responses.
- API health monitoring.

## 4. API Endpoints

**Base URL:**  
`https://breathebetter-ai.onrender.com`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend service information |
| GET | `/health` | Checks backend health |
| GET | `/api/air-quality` | Retrieves current air-quality estimates |
| GET | `/api/air-quality/forecast` | Retrieves 24-hour AQI forecast |

Interactive documentation:

`https://breathebetter-ai.onrender.com/docs`

## 5. Air Quality Data Processing

The backend retrieves atmospheric pollutant concentrations from the Open-Meteo Air Quality API using the CAMS model.

The following six pollutants are processed:

1. PM2.5
2. PM10
3. Carbon Monoxide (CO)
4. Nitrogen Dioxide (NO2)
5. Sulphur Dioxide (SO2)
6. Ozone (O3)

The backend calculates pollutant sub-indices using CPCB-style breakpoint tables and the corresponding averaging periods.

The overall AQI estimate is determined using valid pollutant sub-indices, subject to the minimum data-coverage requirements.

## 6. Forecast Processing

The forecast endpoint retrieves model-based pollutant forecast data and processes it into hourly AQI estimates.

The frontend uses these responses to display the upcoming 24-hour air-quality trend.

## 7. Local Setup

### Prerequisites

- Python 3.10 or later
- pip

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/BreatheBetter-AI.git
cd BreatheBetter-AI/backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI application:

```bash
uvicorn main:app --reload
```

The backend will be available at:

`http://127.0.0.1:8000`

Swagger API documentation:

`http://127.0.0.1:8000/docs`

## 8. Data Source and Limitations

**Data provider:** Open-Meteo Air Quality API  
**Atmospheric model:** Copernicus Atmosphere Monitoring Service (CAMS)

The AQI values are calculated from model-based pollutant concentration estimates. They are not direct CPCB monitoring-station measurements.

Forecast values are model-based estimates, not official CPCB forecasts.

## 9. Deployment

The backend is deployed on Render.

**Production URL:**  
https://breathebetter-ai.onrender.com

## 10. Future Enhancements

- Gemini-powered personalized air-quality assistance.
- MongoDB Atlas integration.
- Dynamic pollution-aware route recommendations.
- Enhanced personalized recommendations.
- Historical air-quality analysis.

---

**Project:** BreatheBetter AI  
**Challenge:** Google Developers Prompt War – Challenge 06
