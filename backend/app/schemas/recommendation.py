from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class RecommendationResponse(BaseModel):
    id: int
    student_id: int
    category: str # APTITUDE, CODING, COMMUNICATION, RESUME, INTERNSHIP, INTERVIEW
    severity: str # HIGH, MEDIUM, LOW
    title: str
    description: str
    actionable_steps: List[str]
    target_score_improvement: float
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class RoadmapMilestone(BaseModel):
    id: str
    title: str
    description: str
    duration_days: int
    is_completed: bool = False
    resource_url: Optional[str] = None
    practical_task: str

class RoadmapStage(BaseModel):
    week: int
    title: str
    milestones: List[RoadmapMilestone]

class LearningRoadmapResponse(BaseModel):
    id: int
    student_id: int
    title: str
    target_role: str
    estimated_weeks: int
    progress_percentage: float
    stages: List[Dict[str, Any]]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ProgressRecordResponse(BaseModel):
    id: int
    student_id: int
    activity_type: str
    details: str
    xp_or_score_change: float
    created_at: datetime

    class Config:
        from_attributes = True
