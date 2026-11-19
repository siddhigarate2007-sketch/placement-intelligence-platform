from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.dependencies import get_current_user, RequireRole
from app.models.user import User, Department
from app.models.student import Student, AcademicRecord, Skill, Internship, Project, Certification, Resume
from app.schemas.student import (
    StudentResponse, StudentUpdate, SkillCreate, SkillResponse,
    ProjectCreate, ProjectResponse, InternshipCreate, InternshipResponse,
    CertificationCreate, CertificationResponse, AcademicRecordCreate, AcademicRecordResponse,
    ResumeResponse
)
from app.services.resume_analyzer import resume_analyzer

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/me", response_model=StudentResponse)
def get_my_student_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return student

@router.put("/me", response_model=StudentResponse)
def update_my_student_profile(
    updates: StudentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")

    update_data = updates.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student

@router.post("/me/skills", response_model=SkillResponse)
def add_skill(
    skill_in: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    skill = Skill(student_id=student.id, **skill_in.dict())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/me/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    skill = db.query(Skill).filter(Skill.id == skill_id, Skill.student_id == student.id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return {"message": "Skill removed successfully"}

@router.post("/me/projects", response_model=ProjectResponse)
def add_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    project = Project(student_id=student.id, **project_in.dict())
    student.projects_count += 1
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.post("/me/internships", response_model=InternshipResponse)
def add_internship(
    internship_in: InternshipCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    internship = Internship(student_id=student.id, **internship_in.dict())
    student.internships_count += 1
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship

@router.post("/me/certifications", response_model=CertificationResponse)
def add_certification(
    cert_in: CertificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    cert = Certification(student_id=student.id, **cert_in.dict())
    student.certifications_count += 1
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert

@router.post("/me/resume/analyze")
def analyze_resume_text(
    resume_text: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    analysis = resume_analyzer.analyze_text(resume_text)

    # Save resume record
    resume_rec = Resume(
        student_id=student.id,
        file_name="Analyzed_Resume_Submission.pdf",
        ats_score=analysis["ats_score"],
        parsed_skills=analysis["parsed_skills"],
        missing_sections=analysis["missing_sections"],
        suggestions=analysis["suggestions"]
    )
    db.add(resume_rec)
    db.commit()
    db.refresh(resume_rec)

    return {
        "resume_id": resume_rec.id,
        "ats_score": analysis["ats_score"],
        "word_count": analysis["word_count"],
        "found_sections": analysis["found_sections"],
        "missing_sections": analysis["missing_sections"],
        "parsed_skills": analysis["parsed_skills"],
        "suggestions": analysis["suggestions"]
    }

@router.get("/all", response_model=List[StudentResponse])
def get_all_students(
    department_code: Optional[str] = Query(None),
    batch_year: Optional[int] = Query(None),
    placement_status: Optional[str] = Query(None),
    min_cgpa: Optional[float] = Query(None),
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(RequireRole(["OFFICER", "FACULTY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    if department_code:
        query = query.join(Department).filter(Department.code == department_code)
    if batch_year:
        query = query.filter(Student.batch_year == batch_year)
    if placement_status:
        query = query.filter(Student.placement_status == placement_status)
    if min_cgpa:
        query = query.filter(Student.cgpa >= min_cgpa)

    return query.offset(skip).limit(limit).all()
