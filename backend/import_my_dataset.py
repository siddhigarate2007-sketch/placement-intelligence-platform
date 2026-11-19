import sys
from pathlib import Path
from app.ml.dataset_importer import import_and_standardize_csv
from app.ml.trainer import train_and_evaluate_all_models

def main():
    if len(sys.argv) < 2:
        print("Usage: python import_my_dataset.py <path_to_csv_file>")
        print("Example: python import_my_dataset.py my_college_placement_data.csv")
        return

    csv_path = Path(sys.argv[1])
    if not csv_path.exists():
        print(f"Error: File not found at '{csv_path}'")
        return

    print(f"[Dataset Importer] Reading and standardizing '{csv_path.name}'...")
    df, mapping = import_and_standardize_csv(csv_path)
    print(f"[Dataset Importer] Successfully imported {len(df)} records!")
    print(f"[Dataset Importer] Mapped columns:")
    for orig, standard in mapping.items():
        print(f"  - '{orig}' -> '{standard}'")

    print("\n[ML Engine] Retraining all 6 candidate algorithms on your new dataset...")
    report = train_and_evaluate_all_models()
    print(f"\n[ML Engine] Retraining Complete!")
    print(f"Champion Model: {report.get('champion_model')}")
    print("Models & Metrics:")
    for m in report.get("models", []):
        star = "★ " if m.get("is_champion") else "  "
        print(f"{star}{m['algorithm']:<26}: Test Acc={(m['test_accuracy']*100):.1f}% | ROC-AUC={(m['test_roc_auc']*100):.1f}% | F1={(m['test_f1']*100):.1f}%")

if __name__ == "__main__":
    main()
