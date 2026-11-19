from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(50), nullable=False) # APTITUDE, CODING, COMMUNICATION, RESUME, INTERNSHIP, INTERVIEW
    severity = Column(String(20), default="MEDIUM") # HIGH, MEDIUM, LOW
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    actionable_steps = Column(JSON, default=list) # List of clear concrete actions
    target_score_improvement = Column(Float, default=10.0)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="recommendations")

class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    target_role = Column(String(100), default="Full Stack Engineer")
    estimated_weeks = Column(Integer, default=6)
    progress_percentage = Column(Float, default=0.0)
    stages = Column(JSON, default=list) # List of stages: {week, title, tasks: [{name, done, resourceUrl}]}
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="roadmaps")

class ProgressRecord(Base):
    __tablename__ = "progress_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    activity_type = Column(String(50), nullable=False) # ASSESSMENT_TAKEN, RESUME_UPDATED, ROADMAP_TASK_DONE, MOCK_INTERVIEW
    details = Column(String(255), nullable=False)
    xp_or_score_change = Column(Float, default=5.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
