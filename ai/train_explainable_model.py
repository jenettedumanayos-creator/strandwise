import json
from pathlib import Path

import joblib
import mysql.connector
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "ai" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "strandwise",
}

FEATURE_COLUMNS = [
    "science",
    "math",
    "business",
    "arts",
    "technology",
    "communication",
]
TARGET_COLUMN = "target_strand"


def build_features(rows: pd.DataFrame) -> pd.DataFrame:
    rows = rows.copy()
    rows["bucket"] = rows["question_no"] % 6

    bucket_to_feature = {
        1: "math",
        2: "science",
        3: "technology",
        4: "business",
        5: "arts",
        0: "communication",
    }

    rows["feature"] = rows["bucket"].map(bucket_to_feature)
    rows["answer_score"] = ((rows["answer_index"] + 1) / 4.0) * 100.0

    agg = (
        rows.groupby(["assessment_id", "feature"], as_index=False)["answer_score"]
        .mean()
        .pivot(index="assessment_id", columns="feature", values="answer_score")
        .fillna(0)
        .reset_index()
    )

    for col in FEATURE_COLUMNS:
        if col not in agg.columns:
            agg[col] = 0.0

    return agg[["assessment_id"] + FEATURE_COLUMNS]


def fetch_training_data() -> pd.DataFrame:
    query_answers = """
        SELECT assessment_id, question_no, answer_index
        FROM assessment_answers
    """
    query_labels = """
        SELECT assessment_id, strand_code AS target_strand
        FROM recommendations
        WHERE rank_position = 1
    """

    conn = mysql.connector.connect(**DB_CONFIG)
    try:
        answers = pd.read_sql(query_answers, conn)
        labels = pd.read_sql(query_labels, conn)
    finally:
        conn.close()

    if answers.empty or labels.empty:
        raise RuntimeError(
            "Not enough training data. Submit assessments first so recommendations exist."
        )

    features = build_features(answers)
    data = features.merge(labels, on="assessment_id", how="inner")
    return data


def main() -> None:
    data = fetch_training_data()

    if len(data) < 25:
        raise RuntimeError(
            f"Need at least 25 records for baseline training. Found: {len(data)}"
        )

    x = data[FEATURE_COLUMNS]
    y = data[TARGET_COLUMN]

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=250,
        max_depth=8,
        min_samples_leaf=2,
        random_state=42,
    )
    model.fit(x_train, y_train)

    preds = model.predict(x_test)
    report = classification_report(y_test, preds, output_dict=True)

    joblib.dump(model, MODEL_DIR / "strandwise_model.joblib")

    metadata = {
        "feature_columns": FEATURE_COLUMNS,
        "classes": model.classes_.tolist(),
        "metrics": report,
        "feature_importance": {
            name: float(value)
            for name, value in zip(FEATURE_COLUMNS, model.feature_importances_)
        },
    }

    (MODEL_DIR / "metadata.json").write_text(
        json.dumps(metadata, indent=2), encoding="utf-8"
    )

    print("Model training completed.")
    print(f"Saved model: {MODEL_DIR / 'strandwise_model.joblib'}")
    print(f"Saved metadata: {MODEL_DIR / 'metadata.json'}")


if __name__ == "__main__":
    main()
