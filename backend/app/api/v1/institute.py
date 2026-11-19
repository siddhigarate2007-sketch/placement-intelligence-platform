from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, RequireRole
from app.models.user import User
from app.schemas.analytics import InstituteAnalyticsResponse
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/institute", tags=["Institute Management & Analytics"])

@router.get("/analytics", response_model=InstituteAnalyticsResponse)
def get_institute_analytics(
    db: Session = Depends(get_db)
):
    return analytics_service.get_institute_analytics(db)
