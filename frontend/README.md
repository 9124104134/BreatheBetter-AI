# BreatheBetter AI – Frontend

## 1. Overview

The BreatheBetter AI frontend is developed using React, TypeScript, and Vite. It provides an interactive dashboard that helps users understand air-quality conditions and explore practical ways to reduce exposure to air pollution.

The frontend communicates with the FastAPI backend to retrieve current air-quality estimates and 24-hour forecasts.

## 2. Technology Stack

- **React** – Component-based user interface development.
- **TypeScript** – Type-safe application development.
- **Vite** – Frontend development and build tool.
- **CSS** – Styling and responsive layouts.
- **Recharts** – Data visualization and forecast charts.
- **Lucide React** – Interface icons.
- **Fetch API** – Communication with backend endpoints.

## 3. Application Features

### Dashboard
Displays the current estimated AQI, air-quality category, and pollutant information.

### Pollutant Analysis
Displays six pollutant indicators:
- PM2.5
- PM10
- Carbon Monoxide (CO)
- Nitrogen Dioxide (NO2)
- Sulphur Dioxide (SO2)
- Ozone (O3)

### 24-Hour Forecast
Displays model-based air-quality forecast information through an interactive chart.

### Family Profiles
Provides an interface for adding and managing family member profiles.

### Indoor Air Optimization
Presents practical techniques for improving indoor air quality.

### Route Planner
Currently a frontend preview. Dynamic route calculation and live pollution comparisons require backend integration.

### AI Assistant
Currently a frontend preview. Gemini-powered conversational assistance requires backend integration.

### Daily Planner
Provides a family-oriented planning interface. Further customization is planned.

### Notifications
Provides application notification functionality.

### Settings
Displays application information and available preferences.

## 4. Backend Integration

The frontend connects to the deployed FastAPI backend.

**Backend Base URL:**

`https://breathebetter-ai.onrender.com`

### API Endpoints

| Endpoint | Purpose |
|---|---|
| `/api/air-quality` | Retrieves current air-quality estimates |
| `/api/air-quality/forecast` | Retrieves 24-hour forecast data |

The frontend processes the JSON responses and updates the dashboard components.

## 5. Local Setup

### Prerequisites
- Node.js
- npm

### Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/BreatheBetter-AI.git
cd BreatheBetter-AI/frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Vite will provide a local development URL, typically:

`http://localhost:5173`

### Production Build

```bash
npm run build
```

## 6. Deployment

The frontend is deployed using Vercel.

**Frontend URL:**

https://breathe-better-ai-frontend.vercel.app/

## 7. Project Structure

```text
frontend/
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 8. Future Enhancements

- Gemini-powered AI assistant.
- Dynamic low-pollution route comparisons.
- More personalized daily planning.
- Historical air-quality visualizations.
- Persistent family profiles through database integration.
- Additional personalized recommendations.

---

**Project:** BreatheBetter AI  
**Challenge:** Google Developers Prompt War – Challenge 06  
**Theme:** Urban Air Quality Assistant
