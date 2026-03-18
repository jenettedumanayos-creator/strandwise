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

$assessmentName = isset($data['assessment_name']) ? trim((string)$data['assessment_name']) : 'Initial Skill Evaluation';
$totalQuestions = isset($data['total_questions']) ? (int)$data['total_questions'] : 0;
$durationSeconds = isset($data['duration_seconds']) ? (int)$data['duration_seconds'] : null;
$answers = isset($data['answers']) && is_array($data['answers']) ? $data['answers'] : [];

if ($totalQuestions <= 0) {
    jsonResponse(['success' => false, 'message' => 'Total questions must be greater than zero.'], 400);
}

if (count($answers) === 0) {
    jsonResponse(['success' => false, 'message' => 'No answers submitted.'], 400);
}

$normalizedAnswers = [];
foreach ($answers as $questionNo => $answerIndex) {
    $qNo = (int)$questionNo;
    $ans = (int)$answerIndex;

    if ($qNo < 1 || $qNo > $totalQuestions || $ans < 0 || $ans > 20) {
        continue;
    }

    $normalizedAnswers[$qNo] = $ans;
}

if (count($normalizedAnswers) === 0) {
    jsonResponse(['success' => false, 'message' => 'Submitted answers are invalid.'], 400);
}

$pdo = getDB();

try {
    $pdo->beginTransaction();

    $assessmentStmt = $pdo->prepare(
        'INSERT INTO assessments (user_id, assessment_name, total_questions, answered_questions, duration_seconds)
         VALUES (?, ?, ?, ?, ?)'
    );
    $assessmentStmt->execute([
        $userId,
        $assessmentName,
        $totalQuestions,
        count($normalizedAnswers),
        $durationSeconds
    ]);

    $assessmentId = (int)$pdo->lastInsertId();

    $answerStmt = $pdo->prepare(
        'INSERT INTO assessment_answers (assessment_id, question_no, answer_index)
         VALUES (?, ?, ?)'
    );

    ksort($normalizedAnswers);
    foreach ($normalizedAnswers as $qNo => $ans) {
        $answerStmt->execute([$assessmentId, $qNo, $ans]);
    }

    $pdo->commit();

    jsonResponse([
        'success' => true,
        'assessment_id' => $assessmentId,
        'answered_questions' => count($normalizedAnswers)
    ]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('StrandWise save_assessment error: ' . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Failed to save assessment.'], 500);
}
