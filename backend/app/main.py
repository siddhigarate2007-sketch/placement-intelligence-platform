import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging_config import logger
from app.core.database import engine, Base
from app.utils.seed_data import seed_database
from app.api.v1 import (
    auth,
    students,
    predictions,
    assessments,
    recommendations,
    companies,
    applications,
    institute,
    ml_management,
    notifications
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Student Placement Intelligence & Career Readiness Platform...")
    # Initialize DB & Seed data
    seed_database()
    logger.info("Database initialized and ready.")
    yield
    logger.info("Shutting down Student Placement Intelligence API.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise-grade Student Placement Intelligence & Career Readiness Platform API with Explainable AI (SHAP), Multi-Model Placement Prediction, Skill-Gap Analytics, and 7-Stage Campus Recruitment Funnel.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing & Logging Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# Include Versioned API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(predictions.router, prefix=settings.API_V1_STR)
app.include_router(assessments.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(companies.router, prefix=settings.API_V1_STR)
app.include_router(applications.router, prefix=settings.API_V1_STR)
app.include_router(institute.router, prefix=settings.API_V1_STR)
app.include_router(ml_management.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health & Status"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected",
        "ml_engine": "active"
    }

@app.get("/", tags=["Health & Status"])
def root():
    return {
        "message": "Welcome to Student Placement Intelligence & Career Readiness Platform API",
        "docs_url": "/docs",
        "version": settings.VERSION,
        "design_system": "Midnight Glass"
    }
