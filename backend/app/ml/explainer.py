import joblib
import numpy as np
import pandas as pd
try:
    import shap
except Exception:
    shap = None
from typing import Dict, Any, List, Tuple
from app.core.config import settings
from app.ml.pipeline import ALL_FEATURE_NAMES, BASE_FEATURE_NAMES

class PlacementExplainer:
    def __init__(self):
        self.preprocessor_path = settings.MODEL_DIR / "preprocessor.joblib"
        self.model_path = settings.MODEL_DIR / "active_champion_model.joblib"
        self.bg_path = settings.MODEL_DIR / "shap_background.joblib"
        self._explainer = None
        self._model = None
        self._preprocessor = None

    def _ensure_loaded(self):
        if self._model is None:
            try:
                self._model = joblib.load(self.model_path)
                self._preprocessor = joblib.load(self.preprocessor_path)
                if shap is not None:
                    try:
                        self._explainer = shap.TreeExplainer(self._model)
                    except Exception:
                        bg = joblib.load(self.bg_path)
                        self._explainer = shap.Explainer(self._model.predict_proba, bg)
            except Exception:
                self._model = "NUMPY_FALLBACK"

    def explain_instance(self, processed_features: np.ndarray, raw_features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates local SHAP explanations for an individual student prediction.
        """
        self._ensure_loaded()
        
        # Flatten raw_features if values are lists
        clean_raw = {}
        for k, v in raw_features.items():
            if isinstance(v, (list, tuple, np.ndarray)) and len(v) > 0:
                clean_raw[k] = v[0]
            else:
                clean_raw[k] = v

        try:
            shap_vals = self._explainer.shap_values(processed_features)
            if isinstance(shap_vals, list) and len(shap_vals) == 2:
                instance_shap = shap_vals[1][0]
            elif isinstance(shap_vals, np.ndarray) and len(shap_vals.shape) == 3:
                instance_shap = shap_vals[0, :, 1]
            elif isinstance(shap_vals, np.ndarray) and len(shap_vals.shape) == 2:
                instance_shap = shap_vals[0]
            else:
                instance_shap = np.array(shap_vals).flatten()[:len(ALL_FEATURE_NAMES)]
        except Exception:
            # Fallback for linear / other models: use coefficients or feature importances
            coef = getattr(self._model, "coef_", None)
            if coef is not None:
                instance_shap = coef[0] * processed_features[0]
            else:
                importances = getattr(self._model, "feature_importances_", np.ones(len(ALL_FEATURE_NAMES)))
                instance_shap = importances * processed_features[0]

        # Format feature contributions
        contributions = []
        for name, val in zip(ALL_FEATURE_NAMES, instance_shap):
            raw_val = clean_raw.get(name, None)
            contributions.append({
                "feature": name,
                "label": name.replace("_", " ").title(),
                "shap_value": round(float(val), 4),
                "actual_value": raw_val,
                "impact": "POSITIVE" if val > 0 else "NEGATIVE"
            })

        # Sort by absolute impact
        contributions.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
        
        top_strengths = [c for c in contributions if c["shap_value"] > 0][:4]
        top_weaknesses = [c for c in contributions if c["shap_value"] < 0][:4]

        # Calculate multidimensional competency scores (0 - 100 scale)
        cgpa = float(clean_raw.get("cgpa", 7.0))
        tenth = float(clean_raw.get("tenth_percentage", 75.0))
        twelfth = float(clean_raw.get("twelfth_percentage", 75.0))
        backlogs = int(clean_raw.get("backlogs", 0))
        
        academic_score = max(0.0, min(100.0, round(((cgpa / 10.0) * 0.5 + (tenth / 100.0) * 0.25 + (twelfth / 100.0) * 0.25) * 100 - (backlogs * 10), 1)))
        coding_score = float(clean_raw.get("coding_score", 60.0))
        technical_score = float(clean_raw.get("technical_score", 60.0))
        aptitude_score = float(clean_raw.get("aptitude_score", 60.0))
        communication_score = float(clean_raw.get("communication_score", 60.0))
        
        internships = int(clean_raw.get("internships_count", 0))
        projects = int(clean_raw.get("projects_count", 1))
        certs = int(clean_raw.get("certifications_count", 0))
        experience_score = min(100.0, round((internships * 30.0 + projects * 20.0 + certs * 10.0), 1))

        readiness_breakdown = {
            "academic": academic_score,
            "coding": coding_score,
            "technical": technical_score,
            "aptitude": aptitude_score,
            "communication": communication_score,
            "practical_experience": experience_score
        }

        return {
            "contributions": contributions,
            "top_strengths": top_strengths,
            "top_weaknesses": top_weaknesses,
            "readiness_breakdown": readiness_breakdown
        }

explainer = PlacementExplainer()
