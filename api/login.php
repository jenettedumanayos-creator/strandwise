<?php

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

requireMethod('POST');

$email = strtolower(readPost('email'));
$password = readPost('password');

if ($email === '' || $password === '') {
    jsonResponse(['success' => false, 'message' => 'Email and password are required.'], 400);
}

$pdo = getDB();

try {
    $stmt = $pdo->prepare(
        'SELECT id, firstname, lastname, email, password_hash
         FROM users
         WHERE email = ?
         LIMIT 1'
    );
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, (string)$user['password_hash'])) {
        jsonResponse(['success' => false, 'message' => 'Invalid email or password.'], 401);
    }

    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['user_name'] = trim((string)$user['firstname'] . ' ' . (string)$user['lastname']);

    jsonResponse([
        'success' => true,
        'message' => 'Login successful.',
        'redirect' => 'main.html',
        'user' => [
            'id' => (int)$user['id'],
            'name' => $_SESSION['user_name'],
            'email' => (string)$user['email']
        ]
    ]);
} catch (Throwable $e) {
    error_log('StrandWise login error: ' . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Login failed. Please try again.'], 500);
}
