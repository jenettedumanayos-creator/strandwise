<?php
/**
 * StrandWise - Database Connection
 * 
 * Provides a reusable PDO database connection using the singleton pattern.
 * All backend PHP files should require this file to get a database connection.
 * 
 * Usage:
 *   require_once 'db_connect.php';
 *   $pdo = getDB();
 *   $stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
 *   $stmt->execute([$id]);
 */

require_once __DIR__ . '/config.php';

function getDB(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST
             . ";port=" . DB_PORT
             . ";dbname=" . DB_NAME
             . ";charset=" . DB_CHARSET;

        $options = [
            // Throw exceptions on errors instead of silent failures
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,

            // Return associative arrays by default
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,

            // Use real prepared statements (not emulated) for security
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Log the real error, show a generic message to the user
            error_log('StrandWise DB Connection Error: ' . $e->getMessage());
            http_response_code(500);
            exit('Database connection failed. Please try again later.');
        }
    }

    return $pdo;
}
