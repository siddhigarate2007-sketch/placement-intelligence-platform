from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class PredictionRequest(BaseModel):
    cgpa: float = Field(..., ge=0.0, le=10.0, example=8.2)
    tenth_percentage: float = Field(..., ge=0.0, le=100.0, example=85.0)
    twelfth_percentage: float = Field(..., ge=0.0, le=100.0, example=82.0)
    backlogs: int = Field(0, ge=0, example=0)
    aptitude_score: float = Field(..., ge=0.0, le=100.0, example=75.0)
    coding_score: float = Field(..., ge=0.0, le=100.0, example=70.0)
    technical_score: float = Field(..., ge=0.0, le=100.0, example=72.0)
    communication_score: float = Field(..., ge=0.0, le=100.0, example=80.0)
    internships_count: int = Field(0, ge=0, example=1)
    projects_count: int = Field(1, ge=0, example=3)
    certifications_count: int = Field(0, ge=0, example=2)

class ShapContribution(BaseModel):
    feature: str
    label: str
    shap_value: float
    actual_value: Any
    impact: str

class ReadinessBreakdown(BaseModel):
    academic: float
    coding: float
    technical: float
    aptitude: float
    communication: float
    practical_experience: float

class WeaknessTrigger(BaseModel):
    area: str
    reason: str

class PredictionResponse(BaseModel):
    id: Optional[int] = None
    student_id: Optional[int] = None
    placed_probability: float
    probability_percentage: float
    predicted_status: str
    readiness_score: float
    confidence: float
    readiness_breakdown: ReadinessBreakdown
    top_strengths: List[ShapContribution]
    top_weaknesses: List[ShapContribution]
    contributions: List[ShapContribution]
    weakness_triggers: List[WeaknessTrigger]
    created_at: Optional[datetime] = None

class ModelVersionResponse(BaseModel):
    key: str
    algorithm: str
    version: str
    cv_accuracy_mean: float
    cv_f1_mean: float
    cv_roc_auc_mean: float
    test_accuracy: float
    test_precision: float
    test_recall: float
    test_f1: float
    test_roc_auc: float
    parameters: Dict[str, Any]
    is_champion: bool

class ModelComparisonResponse(BaseModel):
    timestamp: str
    total_samples: int
    train_samples: int
    test_samples: int
    champion_model: str
    models: List[ModelVersionResponse]
    feature_names: List[str]
