# 🌿 BreatheBetter AI – Smart Urban Air Quality Assistant

**Helping families make healthier daily decisions through personalized air-quality insights.**

## 🌍 Overview

BreatheBetter AI is an AI-powered urban air-quality assistant designed to help families understand air pollution and make informed decisions during periods of poor air quality.

The platform provides real-time model-based air-quality estimates, pollutant information, 24-hour forecasts, indoor air optimization techniques, and family-oriented recommendations.

Our goal is to make air-quality information understandable and actionable for everyday life.

## 🎯 Problem Statement

Urban air pollution, particularly during winter, can affect the daily activities and well-being of families. Existing air-quality platforms often present technical pollution data without translating it into practical everyday guidance.

Families need an accessible solution that helps them understand current air conditions, plan safer routines, and reduce indoor exposure.

## 💡 Our Solution

BreatheBetter AI combines air-quality data, intelligent assistance, and family-focused features in a single dashboard.

It aims to transform pollution information into practical guidance for everyday decisions.

## ✨ Key Features

- **Live Air Quality Dashboard:** Displays the estimated AQI and pollutant information.
- **Pollutant Analysis:** Shows PM2.5, PM10, CO, NO2, SO2, and O3 information.
- **24-Hour AQI Forecast:** Provides model-based air-quality forecasts.
- **Family Profiles:** Allows users to maintain family member profiles.
- **Indoor Air Optimization:** Provides techniques to improve indoor air quality.
- **Route Planner:** Frontend preview for future low-pollution route comparisons.
- **AI Assistant:** Frontend preview for future personalized air-quality assistance.
- **Daily Planner:** Family-oriented daily planning interface, planned for further customization.
- **Notifications:** Provides application notifications.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| Air Quality Data | Open-Meteo Air Quality API (CAMS) |
| AI Integration | Gemini – planned |
| Database | MongoDB Atlas – planned |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## 🏗️ System Architecture

```text
        User
         |
         v
  React + TypeScript
      Frontend
         |
         v
     FastAPI
      Backend
         |
         v
 Open-Meteo Air Quality API
       (CAMS)
         |
         v
 AQI Calculation and
 Pollutant Analysis
         |
         v
 AQI Dashboard and
 24-Hour Forecast
```

Future integrations will extend this architecture with Gemini-powered assistance and MongoDB persistence.

## 🌫️ Air Quality Data and Methodology

BreatheBetter AI retrieves atmospheric pollutant concentration estimates from the Open-Meteo Air Quality API using the CAMS model.

The backend calculates AQI estimates using CPCB-style pollutant breakpoints and averaging periods.

The application currently considers six pollutants:

- PM2.5
- PM10
- Carbon Monoxide (CO)
- Nitrogen Dioxide (NO2)
- Sulphur Dioxide (SO2)
- Ozone (O3)

**Data transparency:** These are model-based estimates, not direct measurements from CPCB monitoring stations. Forecast values are model forecasts and should not be interpreted as official CPCB forecasts.

## 🔗 Backend API

Base URL:

`https://breathebetter-ai.onrender.com`

| Endpoint | Description |
|---|---|
| `/` | Backend service information |
| `/health` | Backend health check |
| `/docs` | Interactive API documentation |
| `/api/air-quality` | Current estimated air quality |
| `/api/air-quality/forecast` | 24-hour air-quality forecast |

Example:

```text
https://breathebetter-ai.onrender.com/api/air-quality?latitude=13.0827&longitude=80.2707
```

## 🚀 Deployment

- **Frontend:** https://breathe-better-ai-frontend.vercel.app/
- **Backend:** https://breathebetter-ai.onrender.com

## 📁 Project Structure

```text
BreatheBetter-AI/
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
│
├── docs/
│   └── architecture.md
│
├── tests/
│   └── README.md
│
├── README.md
├── .gitignore
└── LICENSE
```

## 🔮 Future Enhancements

- Gemini-powered personalized air-quality assistant.
- Dynamic low-pollution route recommendations.
- MongoDB-based family profile persistence.
- Customized daily activity planning.
- Historical air-quality trends.
- Enhanced personalized recommendations and notifications.

## ⚙️ Project Status

The current implementation includes the deployed frontend and backend, live model-based AQI estimates, pollutant analysis, and 24-hour forecasts.

Other features are at different stages of development. Route Planner and AI Assistant backend integration, Daily Planner customization, and additional planned integrations remain future work.

## 👥 Project Information

**Project:** BreatheBetter AI  
**Challenge:** Google Developers Prompt War – Challenge 06  
**Theme:** Urban Air Quality Assistant

---

*BreatheBetter AI – Breathe smarter. Live healthier.*
