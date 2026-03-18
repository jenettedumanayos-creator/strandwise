# StrandWise Setup and AI Build Steps

## 1) Database initialization

1. Open phpMyAdmin.
2. Ensure database `strandwise` exists.
3. Import `database/schema.sql`.

## 2) Backend API endpoints now available

- `api/register.php`
- `api/login.php`
- `api/logout.php`
- `api/session.php`
- `api/get_schools.php`
- `api/save_assessment.php`
- `api/recommend.php`

## 3) Current recommendation mode

The live app currently uses a deterministic explainable rules engine in `api/recommend.php`.

It stores:
- per-assessment recommendations (`recommendations` table)
- top factor explanations (`recommendation_explanations` table)

## 4) Start collecting training data

1. Register users from `login.html`.
2. Have users submit assessments in `main.html`.
3. Confirm rows are being added to:
   - `assessments`
   - `assessment_answers`
   - `recommendations`
   - `recommendation_explanations`

## 5) Train the ML model (next phase)

See `ai/README.md` for commands.

Quick commands:

```bash
pip install -r ai/requirements.txt
python ai/train_explainable_model.py
python ai/predict_with_explanations.py
```

## 6) Production recommendation roadmap

1. Keep `api/recommend.php` as a fallback.
2. Add Python inference service for ML model predictions.
3. Return both probability and top feature explanation per recommendation.
4. Track model version in API responses and DB.
