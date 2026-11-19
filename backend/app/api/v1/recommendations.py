from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.recommendation import Recommendation, LearningRoadmap, ProgressRecord
from app.schemas.recommendation import RecommendationResponse, LearningRoadmapResponse
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Improvement Recommendations & Roadmap"])

@router.get("/", response_model=List[RecommendationResponse])
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    existing_recs = db.query(Recommendation).filter(Recommendation.student_id == student.id).all()
    if not existing_recs:
        # Generate new tailored recommendations
        raw_recs = recommendation_service.generate_recommendations(student)
        created_records = []
        for r in raw_recs:
            rec = Recommendation(
                student_id=student.id,
                category=r["category"],
                severity=r["severity"],
                title=r["title"],
                description=r["description"],
                actionable_steps=r["actionable_steps"],
                target_score_improvement=r["target_score_improvement"],
                is_completed=False
            )
            db.add(rec)
            created_records.append(rec)
        db.commit()
        for c in created_records:
            db.refresh(c)
        return created_records

    return existing_recs

@router.get("/roadmap", response_model=LearningRoadmapResponse)
def get_learning_roadmap(
    target_role: str = "Full Stack Engineer",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    roadmap = db.query(LearningRoadmap).filter(LearningRoadmap.student_id == student.id).first()
    if not roadmap:
        blueprint = recommendation_service.generate_personalized_roadmap(student, target_role)
        roadmap = LearningRoadmap(
            student_id=student.id,
            title=blueprint["title"],
            target_role=blueprint["target_role"],
            estimated_weeks=blueprint["estimated_weeks"],
            progress_percentage=blueprint["progress_percentage"],
            stages=blueprint["stages"],
            is_active=True
        )
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)

    return roadmap

@router.post("/roadmap/milestone/{milestone_id}/toggle")
def toggle_roadmap_milestone(
    milestone_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    roadmap = db.query(LearningRoadmap).filter(LearningRoadmap.student_id == student.id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    stages = list(roadmap.stages)
    found = False
    new_state = False

    for s in stages:
        for m in s.get("milestones", []):
            if m.get("id") == milestone_id:
                m["is_completed"] = not m.get("is_completed", False)
                new_state = m["is_completed"]
                found = True
                break

    if not found:
        raise HTTPException(status_code=404, detail="Milestone ID not found in roadmap")

    # Recalculate progress percentage
    total = sum(len(s.get("milestones", [])) for s in stages)
    done = sum(sum(1 for m in s.get("milestones", []) if m.get("is_completed")) for s in stages)
    progress_pct = round((done / total * 100), 1) if total > 0 else 0.0

    roadmap.stages = stages
    roadmap.progress_percentage = progress_pct
    
    # Add progress record
    progress = ProgressRecord(
        student_id=student.id,
        activity_type="ROADMAP_MILESTONE",
        details=f"Updated milestone '{milestone_id}' state to {'Completed' if new_state else 'Pending'}",
        xp_or_score_change=5.0 if new_state else -5.0
    )
    db.add(progress)
    db.commit()
    db.refresh(roadmap)

    return {
        "milestone_id": milestone_id,
        "is_completed": new_state,
        "overall_progress_percentage": progress_pct
    }
