from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    roll_number = Column(String(50), unique=True, index=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    batch_year = Column(Integer, nullable=False, default=2026)
    
    # Core performance metrics
    cgpa = Column(Float, default=7.0, nullable=False)
    tenth_percentage = Column(Float, default=80.0, nullable=False)
    twelfth_percentage = Column(Float, default=80.0, nullable=False)
    backlogs = Column(Integer, default=0, nullable=False)
    
    # Competency benchmark scores (0-100)
    aptitude_score = Column(Float, default=65.0, nullable=False)
    coding_score = Column(Float, default=60.0, nullable=False)
    technical_score = Column(Float, default=65.0, nullable=False)
    communication_score = Column(Float, default=70.0, nullable=False)
    
    # Portfolio flags
    internships_count = Column(Integer, default=0)
    projects_count = Column(Integer, default=1)
    certifications_count = Column(Integer, default=0)
    
    placement_status = Column(String(50), default="NOT_PLACED") # NOT_PLACED, PLACED, OPTED_OUT
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="student_profile")
    department = relationship("Department", back_populates="students")
    academic_records = relationship("AcademicRecord", back_populates="student", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="student", cascade="all, delete-orphan")
    internships = relationship("Internship", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="student", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="student", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")
    roadmaps = relationship("LearningRoadmap", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    assessment_submissions = relationship("AssessmentSubmission", back_populates="student", cascade="all, delete-orphan")

class AcademicRecord(Base):
    __tablename__ = "academic_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    semester = Column(Integer, nullable=False)
    sgpa = Column(Float, nullable=False)
    backlogs_count = Column(Integer, default=0)
    academic_year = Column(String(20), nullable=True)

    student = relationship("Student", back_populates="academic_records")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    category = Column(String(50), default="PROGRAMMING") # PROGRAMMING, FRAMEWORK, DATABASE, TOOL, SOFT_SKILL
    proficiency = Column(String(30), default="INTERMEDIATE") # BEGINNER, INTERMEDIATE, ADVANCED
    verified = Column(Boolean, default=False)

    student = relationship("Student", back_populates="skills")

class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(150), nullable=False)
    role = Column(String(100), nullable=False)
    duration_months = Column(Integer, default=3)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    verified = Column(Boolean, default=True)

    student = relationship("Student", back_populates="internships")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(String(255), nullable=False)
    github_url = Column(String(255), nullable=True)
    live_url = Column(String(255), nullable=True)

    student = relationship("Student", back_populates="projects")

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    issuing_organization = Column(String(150), nullable=False)
    issue_date = Column(DateTime, nullable=True)
    credential_url = Column(String(255), nullable=True)

    student = relationship("Student", back_populates="certifications")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    ats_score = Column(Float, default=70.0)
    parsed_skills = Column(JSON, default=list)
    missing_sections = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="resumes")
