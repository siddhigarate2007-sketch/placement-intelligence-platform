from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.dependencies import get_current_user, RequireRole
from app.models.user import User
from app.models.student import Student
from app.models.placement import Application, JobOpportunity
from app.schemas.placement import ApplicationResponse, ApplicationUpdateStatus
from app.services.eligibility_service import eligibility_service

router = APIRouter(prefix="/applications", tags=["Applications & Placement Funnel"])

@router.get("/my", response_model=List[ApplicationResponse])
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    return db.query(Application).filter(Application.student_id == student.id).all()

@router.post("/apply/{job_id}", response_model=ApplicationResponse)
def apply_to_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    job = db.query(JobOpportunity).filter(JobOpportunity.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opportunity not found")

    # Check for existing application
    existing = db.query(Application).filter(
        Application.student_id == student.id,
        Application.job_id == job.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this position")

    # Evaluate eligibility
    eligibility = eligibility_service.evaluate_eligibility(student, job)
    if not eligibility["eligible"]:
        raise HTTPException(
            status_code=400,
            detail=f"Eligibility check failed: {'; '.join(eligibility['blocking_reasons'])}"
        )

    # Create application starting in APPLIED state
    app = Application(
        student_id=student.id,
        job_id=job.id,
        status="APPLIED",
        current_round="Round 1 - Online Aptitude Assessment"
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

@router.get("/all", response_model=List[ApplicationResponse])
def get_all_applications(
    job_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    current_user: User = Depends(RequireRole(["OFFICER", "FACULTY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    query = db.query(Application)
    if job_id:
        query = query.filter(Application.job_id == job_id)
    if status_filter:
        query = query.filter(Application.status == status_filter)
    return query.all()

@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    update: ApplicationUpdateStatus,
    current_user: User = Depends(RequireRole(["OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = update.status.upper()
    if update.current_round:
        app.current_round = update.current_round
    if update.feedback:
        app.feedback = update.feedback
    
    # If placed, update student placement status
    if app.status == "SELECTED":
        app.student.placement_status = "PLACED"

    db.commit()
    db.refresh(app)
    return app
