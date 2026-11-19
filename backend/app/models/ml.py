from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    version = Column(String(50), nullable=False, unique=True)
    algorithm = Column(String(50), nullable=False)
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    is_active = Column(Boolean, default=False)
    parameters = Column(JSON, default=dict)
    metrics_report = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    predictions = relationship("Prediction", back_populates="model_version")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    model_version_id = Column(Integer, ForeignKey("model_versions.id"), nullable=True)
    
    placed_probability = Column(Float, nullable=False)
    predicted_status = Column(String(20), nullable=False) # PLACED, UNPLACED
    readiness_score = Column(Float, nullable=False) # 0 to 100
    confidence = Column(Float, nullable=False)
    
    input_features = Column(JSON, default=dict)
    shap_values = Column(JSON, default=dict) # Key feature contributions
    readiness_breakdown = Column(JSON, default=dict) # breakdown by category (academic, coding, aptitude, etc.)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="predictions")
    model_version = relationship("ModelVersion", back_populates="predictions")
