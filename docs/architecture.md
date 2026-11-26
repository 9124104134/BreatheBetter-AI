# BreatheBetter AI – System Architecture

## 1. Introduction

BreatheBetter AI is an urban air-quality assistant designed to help families understand air pollution and make informed daily decisions.

The system combines a React-based frontend, a FastAPI backend, and external air-quality data from the Open-Meteo Air Quality API.

## 2. Architecture Overview

The application follows a frontend–backend architecture.

```text
+---------------------------+
|           User            |
+-------------+-------------+
              |
              v
+---------------------------+
|     React Frontend        |
|                           |
|  Dashboard                |
|  Pollutant Cards          |
|  Forecast Chart           |
|  Family Profiles          |
|  Indoor Air               |
|  Route Planner Preview    |
|  AI Assistant Preview     |
+-------------+-------------+
              |
              | HTTP Requests
              v
+---------------------------+
|      FastAPI Backend      |
|                           |
|  API Endpoints            |
|  AQI Calculation          |
|  Pollutant Analysis       |
|  Forecast Processing      |
+-------------+-------------+
              |
              | API Request
              v
+---------------------------+
| Open-Meteo Air Quality API|
|       CAMS Model          |
+---------------------------+
              |
              v
+---------------------------+
| Pollutant Concentrations  |
| and Forecast Data         |
+---------------------------+
              |
              v
+---------------------------+
| AQI Estimates and         |
| Forecast Responses        |
+---------------------------+
              |
              v
+---------------------------+
|     React Dashboard       |
+---------------------------+
```

## 3. Technology Architecture

### Frontend
- React: Builds the user interface.
- TypeScript: Provides type-safe application development.
- Vite: Frontend development and build tool.
- CSS: Handles application styling.
- Recharts: Displays air-quality forecast charts.
- Lucide React: Provides interface icons.

### Backend
- Python: Backend programming language.
- FastAPI: Provides REST API endpoints.
- AQI Calculation: Calculates pollutant sub-indices and overall AQI estimates using CPCB-style breakpoints.

### External Data Source
- Open-Meteo Air Quality API.
- CAMS atmospheric composition model.

## 4. Data Flow

1. The user opens the BreatheBetter AI dashboard.
2. The frontend sends HTTP requests to the FastAPI backend.
3. The backend retrieves atmospheric pollutant data from Open-Meteo.
4. The backend processes pollutant concentrations.
5. AQI estimates are calculated using pollutant-specific breakpoints and averaging periods.
6. The backend returns structured JSON responses.
7. The frontend displays the AQI, pollutant information, and 24-hour forecast.

## 5. Backend API Structure

| Endpoint | Purpose |
|---|---|
| `/` | Backend service information |
| `/health` | Health check |
| `/api/air-quality` | Current air-quality estimate |
| `/api/air-quality/forecast` | 24-hour forecast |

Interactive API documentation is available through FastAPI Swagger UI at `/docs`.

## 6. AQI Calculation

The backend processes six pollutants:

- PM2.5
- PM10
- Carbon Monoxide (CO)
- Nitrogen Dioxide (NO2)
- Sulphur Dioxide (SO2)
- Ozone (O3)

Each pollutant is evaluated using its corresponding breakpoint and averaging period.

The overall AQI estimate is derived from valid pollutant sub-indices, subject to the backend's minimum data-coverage requirements.

## 7. Deployment Architecture

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Air-quality data | Open-Meteo API |

The frontend communicates with the deployed backend through HTTP API requests.

## 8. Planned Integrations

The following capabilities are planned for future development:

- Gemini-powered AI assistant for personalized air-quality guidance.
- Dynamic route planning with pollution comparisons.
- MongoDB Atlas integration for persistent family profiles.
- Enhanced personalized daily planning.
- Historical air-quality trends.

## 9. Data Limitations

The air-quality values are model-based estimates obtained from the Open-Meteo CAMS data source. They are not direct CPCB monitoring-station measurements.

Forecast values represent model forecasts and should not be interpreted as official CPCB forecasts.

The application is intended to provide informational guidance and does not replace official air-quality alerts or medical advice.

---

**Project:** BreatheBetter AI  
**Challenge:** Google Developers Prompt War – Challenge 06  
**Theme:** Urban Air Quality Assistant
