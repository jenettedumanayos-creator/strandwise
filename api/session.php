<?php

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

$userId = currentUserId();
if ($userId === null) {
    jsonResponse([
        'success' => true,
        'authenticated' => false
    ]);
}

$pdo = getDB();

try {
    $stmt = $pdo->prepare('SELECT id, firstname, lastname, email, grade_level FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        session_unset();
        session_destroy();
        jsonResponse([
            'success' => true,
            'authenticated' => false
        ]);
    }

    jsonResponse([
        'success' => true,
        'authenticated' => true,
        'user' => [
            'id' => (int)$user['id'],
            'name' => trim((string)$user['firstname'] . ' ' . (string)$user['lastname']),
            'email' => (string)$user['email'],
            'grade_level' => (int)$user['grade_level']
        ]
    ]);
} catch (Throwable $e) {
    error_log('StrandWise session error: ' . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Failed to load session.'], 500);
}
