-- StrandWise schema and seed data
-- Run in phpMyAdmin or MySQL CLI after creating database `strandwise`.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS schools (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(80) NOT NULL,
    lastname VARCHAR(80) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    school_id INT UNSIGNED NULL,
    grade_level TINYINT UNSIGNED NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assessments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    assessment_name VARCHAR(120) NOT NULL DEFAULT 'Initial Skill Evaluation',
    total_questions INT UNSIGNED NOT NULL,
    answered_questions INT UNSIGNED NOT NULL,
    duration_seconds INT UNSIGNED DEFAULT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assessments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_assessment_user_date (user_id, submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assessment_answers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT UNSIGNED NOT NULL,
    question_no INT UNSIGNED NOT NULL,
    answer_index INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answers_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    UNIQUE KEY uq_assessment_question (assessment_id, question_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS recommendations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT UNSIGNED NOT NULL,
    strand_code VARCHAR(20) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    confidence DECIMAL(5,2) NOT NULL,
    rank_position TINYINT UNSIGNED NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendations_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    INDEX idx_reco_assessment_rank (assessment_id, rank_position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS recommendation_explanations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recommendation_id BIGINT UNSIGNED NOT NULL,
    factor_key VARCHAR(80) NOT NULL,
    factor_label VARCHAR(120) NOT NULL,
    factor_value DECIMAL(6,2) NOT NULL,
    factor_weight DECIMAL(6,2) NOT NULL,
    contribution DECIMAL(6,2) NOT NULL,
    narrative TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_explanations_recommendation FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO schools (name, city)
SELECT * FROM (
    SELECT 'Manila Science High School', 'Manila' UNION ALL
    SELECT 'Quezon City Science High School', 'Quezon City' UNION ALL
    SELECT 'Pasig National High School', 'Pasig' UNION ALL
    SELECT 'Cebu City National Science High School', 'Cebu City' UNION ALL
    SELECT 'Davao City National High School', 'Davao City'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM schools LIMIT 1);
