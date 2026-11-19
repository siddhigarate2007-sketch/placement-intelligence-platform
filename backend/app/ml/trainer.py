import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from typing import Dict, Any, List

from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report

from app.core.config import settings
from app.ml.dataset import load_or_generate_dataset
from app.ml.pipeline import build_preprocessing_pipeline, BASE_FEATURE_NAMES, ALL_FEATURE_NAMES

def train_and_evaluate_all_models() -> Dict[str, Any]:
    """
    Executes full ML pipeline training and comparison:
    1. Logistic Regression
    2. Decision Tree
    3. Random Forest
    4. Support Vector Machine (SVM)
    5. Gradient Boosting
    6. XGBoost
    Evaluates via 5-fold Stratified Cross-Validation, determines the best performer,
    and serializes all models, pipelines, and evaluation metrics.
    """
    print("[ML Engine] Loading empirical benchmark dataset...")
    df = load_or_generate_dataset()
    
    X_raw = df[BASE_FEATURE_NAMES]
    y = df["placed"].values
    
    # Train / Test split (80 / 20) with stratification
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X_raw, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # Fit preprocessing pipeline on training data
    pipeline = build_preprocessing_pipeline()
    X_train = pipeline.fit_transform(X_train_raw)
    X_test = pipeline.transform(X_test_raw)
    
    # Save the fitted preprocessor
    preprocessor_path = settings.MODEL_DIR / "preprocessor.joblib"
    joblib.dump(pipeline, preprocessor_path)
    
    # Define candidate models with tuned hyperparameters
    models_config = {
        "LogisticRegression": {
            "model": LogisticRegression(max_iter=1000, C=1.0, random_state=42),
            "algorithm": "Logistic Regression",
            "params": {"C": 1.0, "solver": "lbfgs", "max_iter": 1000}
        },
        "DecisionTree": {
            "model": DecisionTreeClassifier(max_depth=5, min_samples_split=10, random_state=42),
            "algorithm": "Decision Tree",
            "params": {"max_depth": 5, "min_samples_split": 10, "criterion": "gini"}
        },
        "RandomForest": {
            "model": RandomForestClassifier(n_estimators=100, max_depth=8, min_samples_leaf=3, random_state=42),
            "algorithm": "Random Forest",
            "params": {"n_estimators": 100, "max_depth": 8, "min_samples_leaf": 3}
        },
        "SVM": {
            "model": SVC(probability=True, kernel="rbf", C=1.5, random_state=42),
            "algorithm": "Support Vector Machine",
            "params": {"C": 1.5, "kernel": "rbf", "probability": True}
        },
        "GradientBoosting": {
            "model": GradientBoostingClassifier(n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42),
            "algorithm": "Gradient Boosting",
            "params": {"n_estimators": 100, "learning_rate": 0.08, "max_depth": 4}
        },
        "XGBoost": {
            "model": XGBClassifier(n_estimators=100, learning_rate=0.08, max_depth=4, eval_metric="logloss", random_state=42),
            "algorithm": "XGBoost",
            "params": {"n_estimators": 100, "learning_rate": 0.08, "max_depth": 4}
        }
    }
    
    results = []
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scoring = ["accuracy", "precision", "recall", "f1", "roc_auc"]
    
    best_score = -1.0
    best_model_name = "GradientBoosting"
    
    print("[ML Engine] Running 5-Fold Stratified Cross-Validation on all candidate architectures...")
    for key, cfg in models_config.items():
        estimator = cfg["model"]
        
        # Cross validation scores
        cv_scores = cross_validate(estimator, X_train, y_train, cv=cv, scoring=scoring)
        
        # Fit on full training set and evaluate on held-out test set
        estimator.fit(X_train, y_train)
        y_pred = estimator.predict(X_test)
        y_prob = estimator.predict_proba(X_test)[:, 1]
        
        test_acc = float(accuracy_score(y_test, y_pred))
        test_prec = float(precision_score(y_test, y_pred, zero_division=0))
        test_rec = float(recall_score(y_test, y_pred, zero_division=0))
        test_f1 = float(f1_score(y_test, y_pred, zero_division=0))
        test_auc = float(roc_auc_score(y_test, y_prob))
        
        # Save individual model
        model_save_path = settings.MODEL_DIR / f"{key}.joblib"
        joblib.dump(estimator, model_save_path)
        
        model_result = {
            "key": key,
            "algorithm": cfg["algorithm"],
            "version": f"v1.0-{key.lower()}",
            "cv_accuracy_mean": float(cv_scores["test_accuracy"].mean()),
            "cv_accuracy_std": float(cv_scores["test_accuracy"].std()),
            "cv_f1_mean": float(cv_scores["test_f1"].mean()),
            "cv_roc_auc_mean": float(cv_scores["test_roc_auc"].mean()),
            "test_accuracy": round(test_acc, 4),
            "test_precision": round(test_prec, 4),
            "test_recall": round(test_rec, 4),
            "test_f1": round(test_f1, 4),
            "test_roc_auc": round(test_auc, 4),
            "parameters": cfg["params"],
            "is_champion": False
        }
        results.append(model_result)
        
        print(f" -> {cfg['algorithm']}: Test Acc={test_acc:.4f}, F1={test_f1:.4f}, ROC-AUC={test_auc:.4f}")
        
        # Track best model by ROC-AUC and F1
        if (test_auc + test_f1) > best_score:
            best_score = test_auc + test_f1
            best_model_name = key

    # Mark champion
    for r in results:
        if r["key"] == best_model_name:
            r["is_champion"] = True

    # Link active champion model
    champion_src = settings.MODEL_DIR / f"{best_model_name}.joblib"
    champion_dst = settings.MODEL_DIR / "active_champion_model.joblib"
    joblib.dump(joblib.load(champion_src), champion_dst)
    
    # Save background samples for SHAP (100 samples)
    shap_background = X_train[:100]
    joblib.dump(shap_background, settings.MODEL_DIR / "shap_background.joblib")

    # Save summary report
    summary_report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "champion_model": best_model_name,
        "models": results,
        "feature_names": ALL_FEATURE_NAMES
    }
    
    with open(settings.MODEL_DIR / "model_comparison.json", "w") as f:
        json.dump(summary_report, f, indent=2)

    print(f"[ML Engine] Training complete! Champion model selected: {best_model_name}")
    return summary_report

if __name__ == "__main__":
    train_and_evaluate_all_models()
