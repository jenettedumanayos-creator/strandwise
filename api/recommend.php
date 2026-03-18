<?php

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

requireMethod('POST');
$userId = requireAuth();

$raw = file_get_contents('php://input');
$data = json_decode((string)$raw, true);
if (!is_array($data)) {
    jsonResponse(['success' => false, 'message' => 'Invalid JSON payload.'], 400);
}

$assessmentId = isset($data['assessment_id']) ? (int)$data['assessment_id'] : 0;
if ($assessmentId <= 0) {
    jsonResponse(['success' => false, 'message' => 'assessment_id is required.'], 400);
}

$pdo = getDB();

try {
    $ownerStmt = $pdo->prepare('SELECT id FROM assessments WHERE id = ? AND user_id = ? LIMIT 1');
    $ownerStmt->execute([$assessmentId, $userId]);
    if (!$ownerStmt->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Assessment not found.'], 404);
    }

    $answersStmt = $pdo->prepare('SELECT question_no, answer_index FROM assessment_answers WHERE assessment_id = ?');
    $answersStmt->execute([$assessmentId]);
    $answers = $answersStmt->fetchAll();

    if (!$answers) {
        jsonResponse(['success' => false, 'message' => 'Assessment has no answers.'], 400);
    }

    $features = [
        'science' => 0.0,
        'math' => 0.0,
        'business' => 0.0,
        'arts' => 0.0,
        'technology' => 0.0,
        'communication' => 0.0
    ];

    $countByFeature = [
        'science' => 0,
        'math' => 0,
        'business' => 0,
        'arts' => 0,
        'technology' => 0,
        'communication' => 0
    ];

    foreach ($answers as $row) {
        $qNo = (int)$row['question_no'];
        $answerIndex = (int)$row['answer_index'];
        $baseScore = max(0.0, min(100.0, (($answerIndex + 1) / 4) * 100));

        $bucket = $qNo % 6;
        if ($bucket === 1) {
            $key = 'math';
        } elseif ($bucket === 2) {
            $key = 'science';
        } elseif ($bucket === 3) {
            $key = 'technology';
        } elseif ($bucket === 4) {
            $key = 'business';
        } elseif ($bucket === 5) {
            $key = 'arts';
        } else {
            $key = 'communication';
        }

        $features[$key] += $baseScore;
        $countByFeature[$key] += 1;
    }

    foreach ($features as $key => $value) {
        if ($countByFeature[$key] > 0) {
            $features[$key] = round($value / $countByFeature[$key], 2);
        }
    }

    $strandWeights = [
        'STEM' => ['science' => 0.32, 'math' => 0.32, 'technology' => 0.26, 'communication' => 0.10],
        'ABM' => ['business' => 0.45, 'math' => 0.30, 'communication' => 0.15, 'technology' => 0.10],
        'HUMSS' => ['communication' => 0.40, 'arts' => 0.30, 'science' => 0.15, 'business' => 0.15],
        'TVL' => ['technology' => 0.45, 'math' => 0.25, 'science' => 0.20, 'communication' => 0.10],
        'GAS' => ['science' => 0.20, 'math' => 0.20, 'business' => 0.20, 'arts' => 0.20, 'communication' => 0.20]
    ];

    $ranked = [];
    foreach ($strandWeights as $strandCode => $weights) {
        $score = 0.0;
        $factors = [];

        foreach ($weights as $featureKey => $weight) {
            $featureValue = $features[$featureKey] ?? 0.0;
            $contribution = round($featureValue * $weight, 2);
            $score += $contribution;

            $factors[] = [
                'factor_key' => $featureKey,
                'factor_label' => ucfirst($featureKey),
                'factor_value' => round($featureValue, 2),
                'factor_weight' => $weight,
                'contribution' => $contribution,
                'narrative' => ucfirst($featureKey) . ' contributed ' . $contribution . ' points to ' . $strandCode . '.'
            ];
        }

        usort($factors, static function (array $a, array $b): int {
            return $b['contribution'] <=> $a['contribution'];
        });

        $ranked[] = [
            'strand_code' => $strandCode,
            'score' => round($score, 2),
            'confidence' => round(max(35.0, min(98.0, $score)), 2),
            'factors' => $factors
        ];
    }

    usort($ranked, static function (array $a, array $b): int {
        return $b['score'] <=> $a['score'];
    });

    $modelVersion = 'rules-v1.0';

    $pdo->beginTransaction();

    $insertReco = $pdo->prepare(
        'INSERT INTO recommendations (assessment_id, strand_code, score, confidence, rank_position, model_version)
         VALUES (?, ?, ?, ?, ?, ?)'
    );

    $insertExp = $pdo->prepare(
        'INSERT INTO recommendation_explanations
         (recommendation_id, factor_key, factor_label, factor_value, factor_weight, contribution, narrative)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    foreach ($ranked as $index => $row) {
        $rankPos = $index + 1;
        $insertReco->execute([
            $assessmentId,
            $row['strand_code'],
            $row['score'],
            $row['confidence'],
            $rankPos,
            $modelVersion
        ]);

        $recommendationId = (int)$pdo->lastInsertId();

        foreach (array_slice($row['factors'], 0, 3) as $factor) {
            $insertExp->execute([
                $recommendationId,
                $factor['factor_key'],
                $factor['factor_label'],
                $factor['factor_value'],
                $factor['factor_weight'],
                $factor['contribution'],
                $factor['narrative']
            ]);
        }
    }

    $pdo->commit();

    jsonResponse([
        'success' => true,
        'model_version' => $modelVersion,
        'assessment_id' => $assessmentId,
        'features' => $features,
        'recommendations' => array_map(static function (array $row): array {
            return [
                'strand_code' => $row['strand_code'],
                'score' => $row['score'],
                'confidence' => $row['confidence'],
                'top_factors' => array_slice($row['factors'], 0, 3)
            ];
        }, $ranked)
    ]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('StrandWise recommend error: ' . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Failed to generate recommendation.'], 500);
}
