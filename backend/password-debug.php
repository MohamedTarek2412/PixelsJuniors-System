<?php
declare(strict_types=1);

// تأكد من أن ملف Database.php موجود
require_once __DIR__ . '/config/Database.php';

header('Content-Type: application/json; charset=UTF-8');

function getDatabaseConnection(): ?PDO {
    try {
        $db = \backend\config\Database::getInstance()->getConnection();
        if ($db instanceof PDO) return $db;
    } catch (Throwable $e) {
        echo json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]);
        exit;
    }
    return null;
}

$db = getDatabaseConnection();
if (!$db) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// جلب كل المستخدمين
$stmt = $db->query("SELECT id, full_name, email, password FROM employees");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

$result = [];
foreach ($users as $user) {
    $passwordInfo = [
        'id' => $user['id'],
        'name' => $user['full_name'],
        'email' => $user['email'],
        'password_preview' => substr($user['password'], 0, 30) . '...',
        'password_length' => strlen($user['password']),
        'password_type' => 'unknown',
        'test_results' => []
    ];
    
    // تحليل نوع كلمة المرور
    if (substr($user['password'], 0, 4) === '$2y$') {
        $passwordInfo['password_type'] = 'bcrypt';
    } elseif (substr($user['password'], 0, 9) === '$argon2id') {
        $passwordInfo['password_type'] = 'argon2id';
    } elseif (strlen($user['password']) < 20) {
        $passwordInfo['password_type'] = 'plain_text_likely';
    } else {
        $passwordInfo['password_type'] = 'other_hash';
    }
    
    // اختبار كلمات مرور مختلفة
    $testPasswords = ['123456', 'password', '123', 'admin'];
    
    foreach ($testPasswords as $testPass) {
        $testResult = [
            'password' => $testPass,
            'password_verify' => false,
            'plain_text_match' => false
        ];
        
        // اختبار password_verify
        try {
            $testResult['password_verify'] = password_verify($testPass, $user['password']);
        } catch (Exception $e) {
            $testResult['password_verify_error'] = $e->getMessage();
        }
        
        // اختبار مقارنة نص خام
        $testResult['plain_text_match'] = ($testPass === $user['password']);
        
        if ($testResult['password_verify'] || $testResult['plain_text_match']) {
            $passwordInfo['test_results'][] = $testResult;
        }
    }
    
    $result[] = $passwordInfo;
}

// إنشاء hash جديد لـ 123456
$newHash123456 = password_hash('123456', PASSWORD_DEFAULT);
$newHashPassword = password_hash('password', PASSWORD_DEFAULT);

$response = [
    'users' => $result,
    'suggestions' => [
        'hash_for_123456' => $newHash123456,
        'hash_for_password' => $newHashPassword,
        'sql_update_ahmed' => "UPDATE employees SET password = '$newHash123456' WHERE email = 'AhmedKhaledMabrouk@gmail.com';",
        'sql_update_john' => "UPDATE employees SET password = '$newHashPassword' WHERE email = 'john@pixels.com';"
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>