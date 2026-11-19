import json
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from typing import Dict, Any
from app.core.config import settings
from app.core.dependencies import get_current_user, RequireRole
from app.models.user import User
from app.schemas.ml import ModelComparisonResponse
# Lazy import inside endpoints to avoid eager initialization overhead
from app.ml.dataset_importer import import_and_standardize_csv

router = APIRouter(prefix="/ml", tags=["ML Model Registry & Retraining"])

@router.get("/comparison", response_model=ModelComparisonResponse)
def get_model_comparison():
    report_file = settings.MODEL_DIR / "model_comparison.json"
    if not report_file.exists():
        from app.ml.trainer import train_and_evaluate_all_models
        train_and_evaluate_all_models()
    
    with open(report_file, "r") as f:
        data = json.load(f)
    return data

@router.post("/retrain")
def trigger_retraining(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(RequireRole(["OFFICER", "ADMIN"]))
):
    from app.ml.trainer import train_and_evaluate_all_models
    background_tasks.add_task(train_and_evaluate_all_models)
    return {
        "status": "QUEUED",
        "message": "Model retraining pipeline initiated across all 6 architectures (Logistic Regression, Decision Tree, Random Forest, SVM, Gradient Boosting, XGBoost)."
    }

@router.post("/upload-dataset")
async def upload_custom_dataset(
    file: UploadFile = File(...)
):
    """
    Upload your custom CSV dataset. The system automatically standardizes headers,
    imputes missing fields, replaces the benchmark data, and retrains all 6 ML models immediately.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported")

    upload_temp_path = settings.DATA_DIR / f"temp_upload_{file.filename}"
    with open(upload_temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        df_imported, mapping = import_and_standardize_csv(upload_temp_path)
        # Retrain on the newly imported dataset
        report = train_and_evaluate_all_models()
        return {
            "status": "SUCCESS",
            "message": f"Successfully ingested custom dataset '{file.filename}' with {len(df_imported)} records. All 6 ML models retrained!",
            "rows_ingested": len(df_imported),
            "mapped_columns": mapping,
            "champion_model": report.get("champion_model")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest dataset: {str(e)}")
    finally:
        if upload_temp_path.exists():
            upload_temp_path.unlink()
