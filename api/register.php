<?php

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

requireMethod('POST');

$firstname = readPost('firstname');
$lastname = readPost('lastname');
$email = strtolower(readPost('email'));
$schoolIdRaw = readPost('school_id');
$gradeLevelRaw = readPost('grade_level');
$password = readPost('password');

if ($firstname === '' || $lastname === '' || $email === '' || $schoolIdRaw === '' || $gradeLevelRaw === '' || $password === '') {
    jsonResponse(['success' => false, 'message' => 'Please fill in all fields.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Invalid email address.'], 400);
}

$gradeLevel = (int) $gradeLevelRaw;
if ($gradeLevel < 9 || $gradeLevel > 12) {
    jsonResponse(['success' => false, 'message' => 'Grade level must be between 9 and 12.'], 400);
}

$schoolId = (int) $schoolIdRaw;
if ($schoolId <= 0) {
    jsonResponse(['success' => false, 'message' => 'Invalid school selected.'], 400);
}

if (strlen($password) < 8) {
    jsonResponse(['success' => false, 'message' => 'Password must be at least 8 characters.'], 400);
}

$pdo = getDB();

try {
    $checkSchoolStmt = $pdo->prepare('SELECT id FROM schools WHERE id = ? LIMIT 1');
    $checkSchoolStmt->execute([$schoolId]);
    if (!$checkSchoolStmt->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Selected school does not exist.'], 400);
    }

    $existsStmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $existsStmt->execute([$email]);
    if ($existsStmt->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Email is already registered.'], 409);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $insertStmt = $pdo->prepare(
        'INSERT INTO users (firstname, lastname, email, school_id, grade_level, password_hash)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $insertStmt->execute([$firstname, $lastname, $email, $schoolId, $gradeLevel, $passwordHash]);

    jsonResponse([
        'success' => true,
        'message' => 'Account created successfully.'
    ]);
} catch (Throwable $e) {
    error_log('StrandWise register error: ' . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Registration failed. Please try again.'], 500);
}
