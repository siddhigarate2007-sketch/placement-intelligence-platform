from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class QuestionBase(BaseModel):
    question_text: str
    question_type: str = "MCQ" # MCQ, CODE_SNIPPET, CODING_CHALLENGE
    options: List[str] = []
    explanation: Optional[str] = None
    difficulty: str = "MEDIUM"
    topic: Optional[str] = None
    marks: int = 5

class QuestionCreate(QuestionBase):
    correct_answer: str

class QuestionResponse(QuestionBase):
    id: int
    assessment_id: int

    class Config:
        from_attributes = True

class AssessmentBase(BaseModel):
    title: str
    category: str # APTITUDE, CODING, TECHNICAL, COMMUNICATION, MOCK_INTERVIEW
    difficulty: str = "MEDIUM"
    duration_minutes: int = 30
    total_marks: int = 100
    passing_marks: int = 50
    instructions: Optional[str] = None

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentResponse(AssessmentBase):
    id: int
    created_at: datetime
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True

class SubmissionRequest(BaseModel):
    responses: Dict[str, str] # {"question_id": "student_answer"}

class SubmissionResponse(BaseModel):
    id: int
    assessment_id: int
    student_id: int
    score: float
    total_marks: float
    percentage: float
    passed: bool
    feedback: str
    completed_at: datetime
    detailed_results: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True

class MockInterviewRequest(BaseModel):
    target_role: str = "Software Engineer"
    interview_type: str = "HR" # HR or TECHNICAL
    answers: List[Dict[str, str]] # [{"question": "...", "answer": "..."}]

class MockInterviewResponse(BaseModel):
    id: int
    student_id: int
    target_role: str
    interview_type: str
    fluency_score: float
    technical_accuracy_score: float
    confidence_score: float
    overall_score: float
    strengths: List[str]
    improvement_areas: List[str]
    feedback_notes: str
    created_at: datetime

    class Config:
        from_attributes = True
