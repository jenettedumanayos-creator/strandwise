import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "ai" / "models"
MODEL_PATH = MODEL_DIR / "strandwise_model.joblib"
META_PATH = MODEL_DIR / "metadata.json"


def load_assets():
    if not MODEL_PATH.exists() or not META_PATH.exists():
        raise FileNotFoundError(
            "Model artifacts not found. Run `python ai/train_explainable_model.py` first."
        )

    model = joblib.load(MODEL_PATH)
    metadata = json.loads(META_PATH.read_text(encoding="utf-8"))
    return model, metadata


def explain_local_input(model, metadata, feature_values):
    feature_columns = metadata["feature_columns"]
    vector = pd.DataFrame([feature_values], columns=feature_columns)

    probabilities = model.predict_proba(vector)[0]
    classes = metadata["classes"]

    ranked = sorted(
        zip(classes, probabilities), key=lambda x: x[1], reverse=True
    )

    # Local explanation approximation: global feature importance * feature value.
    importances = metadata.get("feature_importance", {})
    contributions = []
    for col in feature_columns:
        contrib = float(importances.get(col, 0.0)) * float(feature_values[col])
        contributions.append((col, contrib, feature_values[col]))

    contributions.sort(key=lambda x: x[1], reverse=True)

    print("Predicted strand probabilities:")
    for strand, prob in ranked:
        print(f"- {strand}: {prob * 100:.2f}%")

    print("\nTop feature contributions:")
    for col, contrib, value in contributions[:3]:
        print(f"- {col}: value={value:.2f}, weighted_contribution={contrib:.2f}")


def main():
    model, metadata = load_assets()

    sample = {
        "science": 82,
        "math": 88,
        "business": 52,
        "arts": 61,
        "technology": 91,
        "communication": 70,
    }

    explain_local_input(model, metadata, sample)


if __name__ == "__main__":
    main()
