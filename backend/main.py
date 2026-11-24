
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="BreatheBetter AI API",
    description="Urban Air Quality Assistant for healthier daily routines",
    version="1.0.0"
)

# Frontend access
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
