from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class AcademicRecordBase(BaseModel):
    semester: int
    sgpa: float
    backlogs_count: int = 0
    academic_year: Optional[str] = "2025-2026"

class AcademicRecordCreate(AcademicRecordBase):
    pass

class AcademicRecordResponse(AcademicRecordBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True

class SkillBase(BaseModel):
    skill_name: str
    category: str = "PROGRAMMING"
    proficiency: str = "INTERMEDIATE"
    verified: bool = False

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True

class InternshipBase(BaseModel):
    company_name: str
    role: str
    duration_months: int = 3
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class InternshipCreate(InternshipBase):
    pass

class InternshipResponse(InternshipBase):
    id: int
    student_id: int
    verified: bool

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    description: str
    technologies: str
    github_url: Optional[str] = None
    live_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True

class CertificationBase(BaseModel):
    title: str
    issuing_organization: str
    issue_date: Optional[datetime] = None
    credential_url: Optional[str] = None

class CertificationCreate(CertificationBase):
    pass

class CertificationResponse(CertificationBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True

class ResumeResponse(BaseModel):
    id: int
    student_id: int
    file_name: str
    ats_score: float
    parsed_skills: List[str]
    missing_sections: List[str]
    suggestions: List[str]
    uploaded_at: datetime

    class Config:
        from_attributes = True

class StudentUpdate(BaseModel):
    cgpa: Optional[float] = None
    tenth_percentage: Optional[float] = None
    twelfth_percentage: Optional[float] = None
    backlogs: Optional[int] = None
    aptitude_score: Optional[float] = None
    coding_score: Optional[float] = None
    technical_score: Optional[float] = None
    communication_score: Optional[float] = None
    internships_count: Optional[int] = None
    projects_count: Optional[int] = None
    certifications_count: Optional[int] = None
    placement_status: Optional[str] = None

class StudentResponse(BaseModel):
    id: int
    user_id: int
    roll_number: str
    department_id: int
    batch_year: int
    cgpa: float
    tenth_percentage: float
    twelfth_percentage: float
    backlogs: int
    aptitude_score: float
    coding_score: float
    technical_score: float
    communication_score: float
    internships_count: int
    projects_count: int
    certifications_count: int
    placement_status: str
    created_at: datetime
    skills: List[SkillResponse] = []
    projects: List[ProjectResponse] = []
    internships: List[InternshipResponse] = []
    certifications: List[CertificationResponse] = []
    academic_records: List[AcademicRecordResponse] = []

    class Config:
        from_attributes = True
