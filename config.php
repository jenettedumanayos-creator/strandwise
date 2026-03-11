<?php
/**
 * StrandWise - Database Configuration
 * 
 * This file contains the database connection settings for the StrandWise
 * Senior High School Strand Recommendation System.
 * 
 * XAMPP Default Settings:
 *   Host: localhost
 *   Username: root
 *   Password: (empty)
 *   Port: 3306
 */

// Prevent direct access to this file
if (basename($_SERVER['PHP_SELF']) === basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access not allowed.');
}

// Database credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'strandwise');
define('DB_USER', 'root');
define('DB_PASS', '');       // Default XAMPP MySQL password is empty
define('DB_PORT', 3306);
define('DB_CHARSET', 'utf8mb4');
