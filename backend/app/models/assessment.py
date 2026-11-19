from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False) # APTITUDE, CODING, TECHNICAL, COMMUNICATION, MOCK_INTERVIEW
    difficulty = Column(String(20), default="MEDIUM") # EASY, MEDIUM, HARD
    duration_minutes = Column(Integer, default=30)
    total_marks = Column(Integer, default=100)
    passing_marks = Column(Integer, default=50)
    instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    submissions = relationship("AssessmentSubmission", back_populates="assessment", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(30), default="MCQ") # MCQ, CODE_SNIPPET, CODING_CHALLENGE, SHORT_ANSWER
    options = Column(JSON, default=list) # List of option strings for MCQ
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    difficulty = Column(String(20), default="MEDIUM")
    topic = Column(String(100), nullable=True)
    marks = Column(Integer, default=5)

    assessment = relationship("Assessment", back_populates="questions")

class AssessmentSubmission(Base):
    __tablename__ = "assessment_submissions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=False)
    total_marks = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)
    passed = Column(Boolean, default=False)
    responses = Column(JSON, default=dict) # {"q_id": student_answer}
    feedback = Column(Text, nullable=True)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assessment = relationship("Assessment", back_populates="submissions")
    student = relationship("Student", back_populates="assessment_submissions")

class MockInterview(Base):
    __tablename__ = "mock_interviews"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    target_role = Column(String(100), nullable=False)
    interview_type = Column(String(30), default="HR") # HR, TECHNICAL, SYSTEM_DESIGN
    questions_transcript = Column(JSON, default=list) # list of {question, answer, evaluation, score}
    fluency_score = Column(Float, default=75.0)
    technical_accuracy_score = Column(Float, default=70.0)
    confidence_score = Column(Float, default=80.0)
    overall_score = Column(Float, default=75.0)
    improvement_areas = Column(JSON, default=list)
    strengths = Column(JSON, default=list)
    feedback_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
