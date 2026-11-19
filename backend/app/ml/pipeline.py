import pandas as pd
import numpy as np
try:
    from sklearn.base import BaseEstimator, TransformerMixin
    from sklearn.pipeline import Pipeline
    from sklearn.impute import SimpleImputer
    from sklearn.preprocessing import StandardScaler
except Exception:
    class BaseEstimator: pass
    class TransformerMixin: pass
    Pipeline = None
    SimpleImputer = None
    StandardScaler = None
from typing import List, Tuple

BASE_FEATURE_NAMES = [
    "cgpa",
    "tenth_percentage",
    "twelfth_percentage",
    "backlogs",
    "aptitude_score",
    "coding_score",
    "technical_score",
    "communication_score",
    "internships_count",
    "projects_count",
    "certifications_count",
]

ENGINEERED_FEATURE_NAMES = [
    "academic_consistency",
    "skill_composite",
    "practical_experience"
]

ALL_FEATURE_NAMES = BASE_FEATURE_NAMES + ENGINEERED_FEATURE_NAMES

class PlacementFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Computes domain-specific engineered features:
    - academic_consistency: Mean normalized academic performance
    - skill_composite: Weighted technical and aptitude score
    - practical_experience: Weighted real-world execution capacity
    """
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        if isinstance(X, np.ndarray):
            X_df = pd.DataFrame(X, columns=BASE_FEATURE_NAMES)
        else:
            X_df = X.copy()

        # Feature 1: Academic Consistency
        academic_consistency = (
            (X_df["tenth_percentage"] / 10.0) +
            (X_df["twelfth_percentage"] / 10.0) +
            X_df["cgpa"]
        ) / 3.0

        # Feature 2: Skill Composite
        skill_composite = (
            X_df["coding_score"] * 0.35 +
            X_df["technical_score"] * 0.30 +
            X_df["aptitude_score"] * 0.20 +
            X_df["communication_score"] * 0.15
        )

        # Feature 3: Practical Experience Index
        practical_experience = (
            X_df["internships_count"] * 2.0 +
            X_df["projects_count"] * 1.0 +
            X_df["certifications_count"] * 0.5
        )

        X_extended = X_df.copy()
        X_extended["academic_consistency"] = academic_consistency
        X_extended["skill_composite"] = skill_composite
        X_extended["practical_experience"] = practical_experience

        return X_extended[ALL_FEATURE_NAMES].values

def build_preprocessing_pipeline() -> Pipeline:
    """
    Builds the complete scikit-learn preprocessing pipeline.
    """
    pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("engineer", PlacementFeatureEngineer()),
        ("scaler", StandardScaler())
    ])
    return pipeline
