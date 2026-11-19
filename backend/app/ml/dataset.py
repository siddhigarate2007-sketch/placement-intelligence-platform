import numpy as np
import pandas as pd
from pathlib import Path
from app.core.config import settings

DATASET_PATH = settings.DATA_DIR / "placement_benchmark_dataset.csv"

def generate_benchmark_dataset(num_samples: int = 2500, random_state: int = 42) -> pd.DataFrame:
    """
    Generates a high-fidelity synthetic empirical benchmark dataset for student placement prediction.
    Features strictly exclude personal or protected attributes (no gender, race, religion, etc.).
    Only includes academic, technical, practical, and assessment performance metrics.
    """
    np.random.seed(random_state)
    
    # 1. Academic metrics
    cgpa = np.clip(np.random.normal(loc=7.4, scale=1.1, size=num_samples), 5.0, 10.0).round(2)
    tenth_pct = np.clip(np.random.normal(loc=78.0, scale=10.0, size=num_samples), 50.0, 99.0).round(2)
    twelfth_pct = np.clip(np.random.normal(loc=75.0, scale=11.0, size=num_samples), 50.0, 99.0).round(2)
    
    # Backlogs: Poisson distribution (most have 0, few have 1-4)
    backlogs = np.clip(np.random.poisson(lam=0.4, size=num_samples), 0, 5)
    
    # 2. Assessment scores (0-100)
    aptitude_score = np.clip(np.random.normal(loc=65.0, scale=14.0, size=num_samples), 20.0, 100.0).round(1)
    # Coding score positively correlated with cgpa and aptitude
    coding_noise = np.random.normal(loc=0, scale=12.0, size=num_samples)
    coding_score = np.clip((cgpa * 6.5) + (aptitude_score * 0.3) + coding_noise, 15.0, 100.0).round(1)
    
    technical_score = np.clip((coding_score * 0.5) + (cgpa * 4.5) + np.random.normal(0, 10, num_samples), 20.0, 100.0).round(1)
    communication_score = np.clip(np.random.normal(loc=68.0, scale=13.0, size=num_samples), 30.0, 100.0).round(1)
    
    # 3. Practical experience
    internships_count = np.random.choice([0, 1, 2, 3], size=num_samples, p=[0.40, 0.40, 0.15, 0.05])
    projects_count = np.random.choice([0, 1, 2, 3, 4], size=num_samples, p=[0.10, 0.30, 0.35, 0.18, 0.07])
    certifications_count = np.random.choice([0, 1, 2, 3], size=num_samples, p=[0.30, 0.40, 0.20, 0.10])
    
    # 4. Latent placement readiness calculation (empirical ground truth with realistic noise)
    # Weights reflecting actual campus placement hiring criteria:
    # Coding & Technical (40%), CGPA & Academics (25%), Aptitude (15%), Communication (10%), Experience (10%)
    z = (
        (coding_score - 55) * 0.045 +
        (technical_score - 55) * 0.035 +
        (cgpa - 7.0) * 0.65 +
        (aptitude_score - 60) * 0.030 +
        (communication_score - 60) * 0.025 +
        (internships_count * 0.45) +
        (projects_count * 0.25) +
        (certifications_count * 0.15) -
        (backlogs * 0.85) -
        0.5 +
        np.random.normal(0, 0.55, num_samples) # Real world variance / noise
    )
    
    # Logistic probability
    prob = 1 / (1 + np.exp(-z))
    placed = (prob >= 0.50).astype(int)
    
    df = pd.DataFrame({
        "cgpa": cgpa,
        "tenth_percentage": tenth_pct,
        "twelfth_percentage": twelfth_pct,
        "backlogs": backlogs,
        "aptitude_score": aptitude_score,
        "coding_score": coding_score,
        "technical_score": technical_score,
        "communication_score": communication_score,
        "internships_count": internships_count,
        "projects_count": projects_count,
        "certifications_count": certifications_count,
        "placed": placed
    })
    
    DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(DATASET_PATH, index=False)
    return df

def load_or_generate_dataset() -> pd.DataFrame:
    if DATASET_PATH.exists():
        return pd.read_csv(DATASET_PATH)
    return generate_benchmark_dataset()
