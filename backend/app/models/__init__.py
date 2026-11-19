from app.core.database import Base
from app.models.user import User, Department
from app.models.student import Student, AcademicRecord, Skill, Internship, Project, Certification, Resume
from app.models.ml import ModelVersion, Prediction
from app.models.assessment import Assessment, Question, AssessmentSubmission, MockInterview
from app.models.recommendation import Recommendation, LearningRoadmap, ProgressRecord
from app.models.placement import Company, JobOpportunity, EligibilityRule, Application, InterviewRound, TrainingSession
from app.models.audit import Notification, AuditLog

__all__ = [
    "Base",
    "User",
    "Department",
    "Student",
    "AcademicRecord",
    "Skill",
    "Internship",
    "Project",
    "Certification",
    "Resume",
    "ModelVersion",
    "Prediction",
    "Assessment",
    "Question",
    "AssessmentSubmission",
    "MockInterview",
    "Recommendation",
    "LearningRoadmap",
    "ProgressRecord",
    "Company",
    "JobOpportunity",
    "EligibilityRule",
    "Application",
    "InterviewRound",
    "TrainingSession",
    "Notification",
    "AuditLog"
]
