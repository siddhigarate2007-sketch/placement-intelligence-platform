from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.ml import Prediction, ModelVersion
from app.schemas.ml import PredictionRequest, PredictionResponse
from app.ml.predictor import predictor

router = APIRouter(prefix="/predictions", tags=["ML Predictions"])

@router.post("/predict", response_model=PredictionResponse)
def predict_placement(
    request: PredictionRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Evaluates ML placement probability and readiness using the trained active champion model.
    Generates local SHAP values and identifies top positive/negative feature contributions.
    Persists prediction to database if user is authenticated student.
    """
    feature_dict = request.dict()
    result = predictor.predict(feature_dict)

    prediction_id = None
    student_id = None
    if current_user and current_user.role == "STUDENT":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if student:
            student_id = student.id
            # Fetch active model version id
            active_mv = db.query(ModelVersion).filter(ModelVersion.is_active == True).first()
            pred_record = Prediction(
                student_id=student.id,
                model_version_id=active_mv.id if active_mv else None,
                placed_probability=result["placed_probability"],
                predicted_status=result["predicted_status"],
                readiness_score=result["readiness_score"],
                confidence=result["confidence"],
                input_features=result["input_features"],
                shap_values=result["contributions"],
                readiness_breakdown=result["readiness_breakdown"]
            )
            db.add(pred_record)
            db.commit()
            db.refresh(pred_record)
            prediction_id = pred_record.id

    return {
        "id": prediction_id,
        "student_id": student_id,
        "placed_probability": result["placed_probability"],
        "probability_percentage": result["probability_percentage"],
        "predicted_status": result["predicted_status"],
        "readiness_score": result["readiness_score"],
        "confidence": result["confidence"],
        "readiness_breakdown": result["readiness_breakdown"],
        "top_strengths": result["top_strengths"],
        "top_weaknesses": result["top_weaknesses"],
        "contributions": result["contributions"],
        "weakness_triggers": result["weakness_triggers"],
        "created_at": None
    }

@router.get("/my-history", response_model=List[PredictionResponse])
def get_prediction_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    predictions = db.query(Prediction).filter(Prediction.student_id == student.id).order_by(Prediction.created_at.desc()).limit(10).all()
    
    output = []
    for p in predictions:
        output.append({
            "id": p.id,
            "student_id": p.student_id,
            "placed_probability": p.placed_probability,
            "probability_percentage": round(p.placed_probability * 100, 1),
            "predicted_status": p.predicted_status,
            "readiness_score": p.readiness_score,
            "confidence": p.confidence,
            "readiness_breakdown": p.readiness_breakdown or {},
            "top_strengths": [c for c in (p.shap_values or []) if c.get("shap_value", 0) > 0][:4],
            "top_weaknesses": [c for c in (p.shap_values or []) if c.get("shap_value", 0) < 0][:4],
            "contributions": p.shap_values or [],
            "weakness_triggers": [],
            "created_at": p.created_at
        })
    return output

@router.get("/readiness")
def get_current_readiness(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    features = {
        "cgpa": student.cgpa,
        "tenth_percentage": student.tenth_percentage,
        "twelfth_percentage": student.twelfth_percentage,
        "backlogs": student.backlogs,
        "aptitude_score": student.aptitude_score,
        "coding_score": student.coding_score,
        "technical_score": student.technical_score,
        "communication_score": student.communication_score,
        "internships_count": student.internships_count,
        "projects_count": student.projects_count,
        "certifications_count": student.certifications_count
    }

    result = predictor.predict(features)
    return result
