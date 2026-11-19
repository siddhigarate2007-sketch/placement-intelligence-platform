from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False)
    industry = Column(String(100), nullable=False)
    website = Column(String(200), nullable=True)
    tier = Column(String(30), default="TIER_1") # TIER_1, TIER_2, TIER_3
    location = Column(String(100), default="Bangalore / Remote")
    logo_url = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    jobs = relationship("JobOpportunity", back_populates="company", cascade="all, delete-orphan")

class JobOpportunity(Base):
    __tablename__ = "job_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    job_type = Column(String(30), default="FULL_TIME") # FULL_TIME, INTERNSHIP, INTERN_TO_FTE
    ctc_lpa = Column(Float, nullable=False, default=12.0)
    stipend_monthly = Column(Float, default=30000.0)
    location = Column(String(100), default="Hybrid / Bangalore")
    description = Column(Text, nullable=False)
    deadline = Column(DateTime, nullable=False)
    open_positions = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="jobs")
    eligibility_rule = relationship("EligibilityRule", back_populates="job", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")

class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_opportunities.id", ondelete="CASCADE"), unique=True, nullable=False)
    min_cgpa = Column(Float, default=7.0)
    min_tenth_percentage = Column(Float, default=60.0)
    min_twelfth_percentage = Column(Float, default=60.0)
    max_backlogs = Column(Integer, default=0)
    allowed_departments = Column(JSON, default=list) # e.g. ["CSE", "IT", "ECE"]
    min_aptitude_score = Column(Float, default=60.0)
    min_coding_score = Column(Float, default=50.0)
    required_skills = Column(JSON, default=list) # e.g. ["Python", "SQL"]

    job = relationship("JobOpportunity", back_populates="eligibility_rule")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_opportunities.id", ondelete="CASCADE"), nullable=False)
    # The complete 7-stage placement funnel:
    # REGISTERED -> ELIGIBLE -> APPLIED -> APTITUDE -> TECHNICAL -> HR -> SELECTED (or REJECTED)
    status = Column(String(30), default="APPLIED")
    current_round = Column(String(50), default="Screening")
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    feedback = Column(Text, nullable=True)

    student = relationship("Student", back_populates="applications")
    job = relationship("JobOpportunity", back_populates="applications")
    interview_rounds = relationship("InterviewRound", back_populates="application", cascade="all, delete-orphan")

class InterviewRound(Base):
    __tablename__ = "interview_rounds"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    round_name = Column(String(50), nullable=False) # Aptitude, Technical Round 1, Technical Round 2, HR Round
    round_order = Column(Integer, default=1)
    scheduled_at = Column(DateTime, nullable=True)
    status = Column(String(30), default="PENDING") # PENDING, PASSED, FAILED, RESCHEDULED
    score = Column(Float, nullable=True)
    interviewer_notes = Column(Text, nullable=True)

    application = relationship("Application", back_populates="interview_rounds")

class TrainingSession(Base):
    __tablename__ = "training_sessions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    trainer_name = Column(String(100), nullable=False)
    topic = Column(String(100), nullable=False) # DSA, System Design, Mock Aptitude, Resume Mastery
    scheduled_at = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=90)
    target_departments = Column(JSON, default=list)
    meeting_link = Column(String(255), nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
