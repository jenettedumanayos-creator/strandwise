<?php

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

$pdo = getDB();

try {
    $stmt = $pdo->query('SELECT id, name, city FROM schools ORDER BY name ASC');
    $schools = $stmt->fetchAll();

    jsonResponse([
        'success' => true,
        'schools' => $schools
    ]);
} catch (Throwable $e) {
    error_log('StrandWise schools error: ' . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Failed to load schools.'], 500);
}
