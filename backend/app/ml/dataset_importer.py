import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, Any, Tuple
from app.core.config import settings
from app.ml.pipeline import BASE_FEATURE_NAMES

COLUMN_ALIASES = {
    "cgpa": ["cgpa", "degree_p", "gpa", "btech_cgpa", "college_cgpa", "degree_percentage"],
    "tenth_percentage": ["tenth_percentage", "ssc_p", "10th", "10th_percentage", "tenth_p", "ssc_percentage"],
    "twelfth_percentage": ["twelfth_percentage", "hsc_p", "12th", "12th_percentage", "twelfth_p", "hsc_percentage"],
    "backlogs": ["backlogs", "backlog", "history_of_backlogs", "active_backlogs", "arrears"],
    "aptitude_score": ["aptitude_score", "etest_p", "aptitude", "quant_score", "aptitude_test"],
    "coding_score": ["coding_score", "coding", "programming", "dsa_score", "hackerrank_score"],
    "technical_score": ["technical_score", "technical", "tech_score", "core_cs_score"],
    "communication_score": ["communication_score", "communication", "comm_score", "soft_skills", "verbal_score"],
    "internships_count": ["internships_count", "internships", "internship", "internship_count", "work_experience"],
    "projects_count": ["projects_count", "projects", "project", "projects_num"],
    "certifications_count": ["certifications_count", "certifications", "certs", "certification_count"],
    "placed": ["placed", "status", "placement_status", "is_placed", "placed_status", "result"]
}

def import_and_standardize_csv(file_path: Path) -> Tuple[pd.DataFrame, Dict[str, str]]:
    """
    Reads user-provided CSV, automatically maps column headers to standard schema,
    imputes missing values, encodes target column, and saves to data/placement_benchmark_dataset.csv.
    """
    df_raw = pd.read_csv(file_path)
    col_mapping = {}
    normalized_cols = {col.lower().strip().replace(" ", "_"): col for col in df_raw.columns}

    # Match aliases
    standard_df = pd.DataFrame()
    for standard_name, aliases in COLUMN_ALIASES.items():
        matched_original = None
        for alias in aliases:
            if alias in normalized_cols:
                matched_original = normalized_cols[alias]
                break

        if matched_original is not None:
            col_mapping[matched_original] = standard_name
            series = df_raw[matched_original]

            # Handle target column (Placed / Not Placed or 1 / 0)
            if standard_name == "placed":
                if series.dtype == object or isinstance(series.iloc[0], str):
                    standard_df[standard_name] = series.astype(str).str.strip().str.lower().map(
                        lambda v: 1 if v in ["placed", "yes", "1", "true", "selected", "pass"] else 0
                    )
                else:
                    standard_df[standard_name] = series.fillna(0).astype(int)
            else:
                standard_df[standard_name] = pd.to_numeric(series, errors="coerce")
        else:
            # Fallback reasonable defaults if optional column missing in custom dataset
            if standard_name == "backlogs":
                standard_df[standard_name] = 0
            elif standard_name == "internships_count":
                standard_df[standard_name] = 0
            elif standard_name == "projects_count":
                standard_df[standard_name] = 1
            elif standard_name == "certifications_count":
                standard_df[standard_name] = 0
            elif standard_name == "communication_score":
                standard_df[standard_name] = 70.0
            elif standard_name == "technical_score":
                standard_df[standard_name] = standard_df.get("coding_score", 65.0)
            elif standard_name == "coding_score":
                standard_df[standard_name] = 65.0
            elif standard_name == "aptitude_score":
                standard_df[standard_name] = 65.0
            elif standard_name == "cgpa":
                standard_df[standard_name] = 7.5
            elif standard_name == "tenth_percentage":
                standard_df[standard_name] = 80.0
            elif standard_name == "twelfth_percentage":
                standard_df[standard_name] = 80.0
            elif standard_name == "placed":
                standard_df[standard_name] = 1

    # Impute missing values with column medians
    for col in standard_df.columns:
        if standard_df[col].isnull().any():
            median_val = standard_df[col].median()
            standard_df[col].fillna(median_val, inplace=True)

    # Save to standard dataset path
    dest_path = settings.DATA_DIR / "placement_benchmark_dataset.csv"
    standard_df.to_csv(dest_path, index=False)

    return standard_df, col_mapping
