from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class EligibilityRuleBase(BaseModel):
    min_cgpa: float = 7.0
    min_tenth_percentage: float = 60.0
    min_twelfth_percentage: float = 60.0
    max_backlogs: int = 0
    allowed_departments: List[str] = ["CSE", "IT", "ECE"]
    min_aptitude_score: float = 60.0
    min_coding_score: float = 50.0
    required_skills: List[str] = []

class EligibilityRuleResponse(EligibilityRuleBase):
    id: int
    job_id: int

    class Config:
        from_attributes = True

class CompanyBase(BaseModel):
    name: str
    industry: str
    website: Optional[str] = None
    tier: str = "TIER_1" # TIER_1, TIER_2, TIER_3
    location: str = "Bangalore / Remote"
    logo_url: Optional[str] = None
    description: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class JobOpportunityBase(BaseModel):
    company_id: int
    title: str
    job_type: str = "FULL_TIME" # FULL_TIME, INTERNSHIP, INTERN_TO_FTE
    ctc_lpa: float = 12.0
    stipend_monthly: float = 30000.0
    location: str = "Hybrid / Bangalore"
    description: str
    deadline: datetime
    open_positions: int = 5
    is_active: bool = True

class JobOpportunityCreate(JobOpportunityBase):
    eligibility: Optional[EligibilityRuleBase] = None

class JobOpportunityResponse(JobOpportunityBase):
    id: int
    created_at: datetime
    company: CompanyResponse
    eligibility_rule: Optional[EligibilityRuleResponse] = None

    class Config:
        from_attributes = True

class EligibilityCheckResult(BaseModel):
    eligible: bool
    job_id: int
    job_title: str
    company_name: str
    criteria_results: Dict[str, Dict[str, Any]]
    blocking_reasons: List[str]

class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    job_id: int
    status: str
    current_round: str
    applied_at: datetime
    updated_at: datetime
    feedback: Optional[str] = None
    job: JobOpportunityResponse

    class Config:
        from_attributes = True

class ApplicationUpdateStatus(BaseModel):
    status: str
    current_round: Optional[str] = None
    feedback: Optional[str] = None

class TrainingSessionResponse(BaseModel):
    id: int
    title: str
    trainer_name: str
    topic: str
    scheduled_at: datetime
    duration_minutes: int
    target_departments: List[str]
    meeting_link: Optional[str]
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True
