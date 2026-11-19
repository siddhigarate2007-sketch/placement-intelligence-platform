from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.dependencies import get_current_user, RequireRole
from app.models.user import User
from app.models.student import Student
from app.models.placement import Company, JobOpportunity, EligibilityRule
from app.schemas.placement import (
    CompanyCreate, CompanyResponse, JobOpportunityCreate, JobOpportunityResponse,
    EligibilityCheckResult
)
from app.services.eligibility_service import eligibility_service

router = APIRouter(prefix="/companies", tags=["Companies & Job Opportunities"])

@router.get("/", response_model=List[CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

@router.post("/", response_model=CompanyResponse)
def create_company(
    company_in: CompanyCreate,
    current_user: User = Depends(RequireRole(["OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    company = Company(**company_in.dict())
    db.add(company)
    db.commit()
    db.refresh(company)
    return company

@router.get("/jobs", response_model=List[JobOpportunityResponse])
def get_job_opportunities(
    job_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(JobOpportunity).filter(JobOpportunity.is_active == True)
    if job_type:
        query = query.filter(JobOpportunity.job_type == job_type)
    return query.all()

@router.get("/jobs/{job_id}", response_model=JobOpportunityResponse)
def get_job_opportunity(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobOpportunity).filter(JobOpportunity.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opportunity not found")
    return job

@router.post("/jobs", response_model=JobOpportunityResponse)
def create_job_opportunity(
    job_in: JobOpportunityCreate,
    current_user: User = Depends(RequireRole(["OFFICER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    job_data = job_in.dict(exclude={"eligibility"})
    job = JobOpportunity(**job_data)
    db.add(job)
    db.commit()
    db.refresh(job)

    if job_in.eligibility:
        eligibility = EligibilityRule(job_id=job.id, **job_in.eligibility.dict())
        db.add(eligibility)
        db.commit()
        db.refresh(job)

    return job

@router.get("/jobs/{job_id}/check-eligibility", response_model=EligibilityCheckResult)
def check_student_eligibility(
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

    return eligibility_service.evaluate_eligibility(student, job)
