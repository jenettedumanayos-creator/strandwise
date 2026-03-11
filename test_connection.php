<?php
/**
 * StrandWise - Test Database Connection
 * 
 * Run this file in the browser to verify the MySQL connection works:
 *   http://localhost/strandwise/test_connection.php
 * 
 * DELETE THIS FILE after confirming the connection is working.
 */

require_once __DIR__ . '/db_connect.php';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StrandWise - Database Connection Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; border: 1px solid #c3e6cb; }
        .error   { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; border: 1px solid #f5c6cb; }
        .info    { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 8px; border: 1px solid #bee5eb; margin-top: 10px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        td { padding: 8px; border-bottom: 1px solid #dee2e6; }
        td:first-child { font-weight: bold; width: 40%; }
    </style>
</head>
<body>
    <h1>StrandWise - DB Connection Test</h1>
<?php
try {
    $pdo = getDB();

    // Verify by running a simple query
    $stmt = $pdo->query("SELECT DATABASE() AS db_name, VERSION() AS db_version");
    $info = $stmt->fetch();

    // Get list of tables in the database
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    echo '<div class="success">✅ <strong>Connection Successful!</strong></div>';
    echo '<div class="info">';
    echo '<table>';
    echo '<tr><td>Database:</td><td>' . htmlspecialchars($info['db_name']) . '</td></tr>';
    echo '<tr><td>MySQL Version:</td><td>' . htmlspecialchars($info['db_version']) . '</td></tr>';
    echo '<tr><td>Host:</td><td>' . htmlspecialchars(DB_HOST) . '</td></tr>';
    echo '<tr><td>Charset:</td><td>' . htmlspecialchars(DB_CHARSET) . '</td></tr>';
    echo '<tr><td>Tables Found:</td><td>' . count($tables) . '</td></tr>';
    echo '</table>';

    if (!empty($tables)) {
        echo '<h3>Tables in database:</h3><ul>';
        foreach ($tables as $table) {
            echo '<li>' . htmlspecialchars($table) . '</li>';
        }
        echo '</ul>';
    }
    echo '</div>';

} catch (Exception $e) {
    echo '<div class="error">❌ <strong>Connection Failed:</strong> ' . htmlspecialchars($e->getMessage()) . '</div>';
    echo '<div class="info">';
    echo '<strong>Troubleshooting:</strong><ul>';
    echo '<li>Make sure XAMPP Apache and MySQL services are running</li>';
    echo '<li>Verify the database <code>strandwise</code> exists in phpMyAdmin</li>';
    echo '<li>Check credentials in <code>config.php</code></li>';
    echo '</ul></div>';
}
?>
    <p style="margin-top: 20px; color: #888;"><em>⚠️ Delete this file after testing.</em></p>
</body>
</html>
