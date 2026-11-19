from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class DepartmentMetric(BaseModel):
    department: str
    total_students: int
    placed_students: int
    placement_rate: float
    avg_cgpa: float
    avg_salary_lpa: float

class FunnelStageMetric(BaseModel):
    stage: str
    count: int
    conversion_rate: float

class InstituteAnalyticsResponse(BaseModel):
    total_students: int
    total_placed: int
    total_unplaced: int
    overall_placement_rate: float
    highest_package_lpa: float
    average_package_lpa: float
    median_package_lpa: float
    active_companies: int
    total_offers: int
    department_metrics: List[DepartmentMetric]
    funnel_stages: List[FunnelStageMetric]
    tier_distribution: Dict[str, int]
    skill_demand_trends: List[Dict[str, Any]]
    recent_placements: List[Dict[str, Any]]

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    action_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
