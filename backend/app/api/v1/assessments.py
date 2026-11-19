from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.assessment import Assessment, Question, AssessmentSubmission, MockInterview
from app.models.recommendation import ProgressRecord
from app.schemas.assessment import (
    AssessmentResponse, SubmissionRequest, SubmissionResponse,
    MockInterviewRequest, MockInterviewResponse
)

router = APIRouter(prefix="/assessments", tags=["Assessments & Mock Interview"])

@router.get("/", response_model=List[AssessmentResponse])
def get_assessments(db: Session = Depends(get_db)):
    return db.query(Assessment).all()

@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@router.post("/{assessment_id}/submit", response_model=SubmissionResponse)
def submit_assessment(
    assessment_id: int,
    submission: SubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    questions = db.query(Question).filter(Question.assessment_id == assessment_id).all()
    
    total_marks = sum(q.marks for q in questions) if questions else 100
    earned_marks = 0.0
    detailed_results = []

    for q in questions:
        q_id_str = str(q.id)
        student_ans = submission.responses.get(q_id_str, "").strip()
        is_correct = (student_ans.lower() == q.correct_answer.strip().lower())
        q_score = q.marks if is_correct else 0.0
        earned_marks += q_score
        
        detailed_results.append({
            "question_id": q.id,
            "question_text": q.question_text,
            "student_answer": student_ans,
            "correct_answer": q.correct_answer,
            "is_correct": is_correct,
            "explanation": q.explanation,
            "marks_earned": q_score
        })

    percentage = round((earned_marks / total_marks * 100), 1) if total_marks > 0 else 0.0
    passed = percentage >= (assessment.passing_marks / assessment.total_marks * 100)

    # Update student competency benchmarks based on category
    if assessment.category == "APTITUDE":
        student.aptitude_score = round((student.aptitude_score * 0.7) + (percentage * 0.3), 1)
    elif assessment.category == "CODING":
        student.coding_score = round((student.coding_score * 0.7) + (percentage * 0.3), 1)
    elif assessment.category == "TECHNICAL":
        student.technical_score = round((student.technical_score * 0.7) + (percentage * 0.3), 1)
    elif assessment.category == "COMMUNICATION":
        student.communication_score = round((student.communication_score * 0.7) + (percentage * 0.3), 1)

    feedback_text = (
        f"Excellent performance! You scored {percentage}%. Keep maintaining this benchmark."
        if percentage >= 75
        else f"Completed with {percentage}%. Focus on reviewing the detailed explanations and repeat practice."
    )

    sub_record = AssessmentSubmission(
        assessment_id=assessment.id,
        student_id=student.id,
        score=earned_marks,
        total_marks=total_marks,
        percentage=percentage,
        passed=passed,
        responses=submission.responses,
        feedback=feedback_text
    )
    db.add(sub_record)

    # Progress record XP
    progress = ProgressRecord(
        student_id=student.id,
        activity_type="ASSESSMENT_COMPLETED",
        details=f"Completed {assessment.title} with {percentage}%",
        xp_or_score_change=percentage * 0.1
    )
    db.add(progress)
    db.commit()
    db.refresh(sub_record)

    return {
        "id": sub_record.id,
        "assessment_id": assessment.id,
        "student_id": student.id,
        "score": earned_marks,
        "total_marks": total_marks,
        "percentage": percentage,
        "passed": passed,
        "feedback": feedback_text,
        "completed_at": sub_record.completed_at,
        "detailed_results": detailed_results
    }

@router.post("/mock-interview", response_model=MockInterviewResponse)
def evaluate_mock_interview(
    request: MockInterviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Semantic evaluation of student answers
    total_words = 0
    star_keywords = ["situation", "task", "action", "result", "because", "implemented", "resolved", "improved", "optimized", "team"]
    star_hits = 0
    tech_keywords = ["api", "database", "query", "complexity", "architecture", "cache", "scale", "frontend", "backend", "test"]
    tech_hits = 0

    for item in request.answers:
        ans = item.get("answer", "").lower()
        words = ans.split()
        total_words += len(words)
        star_hits += sum(1 for kw in star_keywords if kw in ans)
        tech_hits += sum(1 for kw in tech_keywords if kw in ans)

    ans_count = max(1, len(request.answers))
    avg_words = total_words / ans_count

    # Scores (0-100)
    fluency_score = min(95.0, max(50.0, round(60.0 + min(30.0, (avg_words / 25.0) * 15.0), 1)))
    technical_accuracy_score = min(96.0, max(45.0, round(55.0 + min(35.0, tech_hits * 3.5), 1)))
    confidence_score = min(94.0, max(55.0, round(65.0 + min(25.0, star_hits * 2.5), 1)))
    overall_score = round((fluency_score * 0.3) + (technical_accuracy_score * 0.4) + (confidence_score * 0.3), 1)

    # Dynamic strengths and improvement areas
    strengths = []
    if fluency_score >= 70:
        strengths.append("Articulate and comprehensive verbal descriptions.")
    if technical_accuracy_score >= 70:
        strengths.append("Effective incorporation of architectural and technical terminology.")
    if confidence_score >= 75:
        strengths.append("Clear and structured problem-resolution mindset.")
    if not strengths:
        strengths.append("Good baseline familiarity with interview flow and role objectives.")

    improvements = []
    if avg_words < 25:
        improvements.append("Expand on answers using the STAR format (Situation, Task, Action, Result).")
    if tech_hits < 3 and request.interview_type == "TECHNICAL":
        improvements.append("Cite concrete technologies, algorithms, and time/space complexities.")
    if confidence_score < 70:
        improvements.append("Rehearse behavioral questions aloud to reduce hesitation and filler words.")
    if not improvements:
        improvements.append("Continue practicing advanced system design and edge-case handling.")

    # Update communication score on student profile
    student.communication_score = round((student.communication_score * 0.75) + (overall_score * 0.25), 1)

    interview_rec = MockInterview(
        student_id=student.id,
        target_role=request.target_role,
        interview_type=request.interview_type,
        questions_transcript=request.answers,
        fluency_score=fluency_score,
        technical_accuracy_score=technical_accuracy_score,
        confidence_score=confidence_score,
        overall_score=overall_score,
        strengths=strengths,
        improvement_areas=improvements,
        feedback_notes=f"Mock interview conducted for {request.target_role} ({request.interview_type}). Overall performance rating: {overall_score}/100."
    )
    db.add(interview_rec)
    db.commit()
    db.refresh(interview_rec)

    return interview_rec
