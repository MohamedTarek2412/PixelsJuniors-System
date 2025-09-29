<?php
// Define APP_SECRET constant
define('APP_SECRET', 'your-secret-key-here-change-this-in-production'); // CHANGE THIS!

// Clean URI function
function getCleanUri(): string {
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    
    // Remove query string
    $uri = strtok($uri, '?');
    
    // Remove script name
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    if ($scriptName && strpos($uri, $scriptName) === 0) {
        $uri = substr($uri, strlen($scriptName));
    }
    
    // Remove /index.php prefix
    if (strpos($uri, '/index.php') === 0) {
        $uri = substr($uri, strlen('/index.php'));
    }
    
    // Remove base path
    $basePath = '/pixels-website/backend';
    if (strpos($uri, $basePath) === 0) {
        $uri = substr($uri, strlen($basePath));
    }
    
    return $uri ?: '/';
}

function respondJson(int $code, $data): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $b64): string {
    $remainder = strlen($b64) % 4;
    if ($remainder) $b64 .= str_repeat('=', 4 - $remainder);
    return base64_decode(strtr($b64, '-_', '+/'));
}

function createToken(array $payload): string {
    $payloadJson = json_encode($payload, JSON_UNESCAPED_SLASHES);
    $payloadB64 = base64UrlEncode($payloadJson);
    $sig = hash_hmac('sha256', $payloadB64, APP_SECRET, true);
    $sigB64 = base64UrlEncode($sig);
    return $payloadB64 . '.' . $sigB64;
}

function verifyToken(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 2) return null;

    [$payloadB64, $sigB64] = $parts;
    $payloadJson = base64UrlDecode($payloadB64);
    if ($payloadJson === false) return null;

    $expectedSig = hash_hmac('sha256', $payloadB64, APP_SECRET, true);
    $sig = base64UrlDecode($sigB64);
    if (!is_string($sig)) return null;

    if (!hash_equals($expectedSig, $sig)) return null;

    $data = json_decode($payloadJson, true);
    if (!is_array($data)) return null;

    if (isset($data['exp']) && time() > (int)$data['exp']) return null;

    return $data;
}

function getDatabaseConnection(): ?PDO {
    try {
        $db = \backend\config\Database::getInstance()->getConnection();
        return $db;
    } catch (Throwable $e) {
        error_log("DB connection failed: " . $e->getMessage());
        return null;
    }
}

function readJsonBody(int $maxBytes = 1_000_000): ?array {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') === false) {
        return null;
    }
    
    $contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > $maxBytes) {
        return null;
    }
    
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return null;
    
    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) return null;
    
    return $data;
}
