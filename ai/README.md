# StrandWise AI Training (Explainable)

This folder contains starter scripts to train an explainable strand recommendation model from assessment data.

## 1) Install dependencies

```bash
pip install -r ai/requirements.txt
```

## 2) Make sure database has data

The trainer reads from MySQL tables created by `database/schema.sql`:
- `assessments`
- `assessment_answers`
- `recommendations` (used as provisional label source)

For stronger supervision, add actual chosen strand labels later.

## 3) Train model

```bash
python ai/train_explainable_model.py
```

Outputs:
- `ai/models/strandwise_model.joblib`
- `ai/models/metadata.json`

## 4) Run local prediction example

```bash
python ai/predict_with_explanations.py
```

This prints predicted probabilities and top feature contributions.

## Notes

- Current production API (`api/recommend.php`) is a deterministic explainable rules engine.
- This ML pipeline is the next stage for data-driven improvements.
- You can later expose ML inference via a Python microservice and call it from PHP.
