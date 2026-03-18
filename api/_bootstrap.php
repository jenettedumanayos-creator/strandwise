<?php

declare(strict_types=1);

require_once __DIR__ . '/../db_connect.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');

function readPost(string $key, string $default = ''): string
{
    return isset($_POST[$key]) ? trim((string)$_POST[$key]) : $default;
}

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requireMethod(string $method): void
{
    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== strtoupper($method)) {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid request method.'
        ], 405);
    }
}

function currentUserId(): ?int
{
    return isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null;
}

function requireAuth(): int
{
    $userId = currentUserId();
    if ($userId === null) {
        jsonResponse([
            'success' => false,
            'message' => 'Unauthorized. Please log in first.'
        ], 401);
    }

    return $userId;
}
