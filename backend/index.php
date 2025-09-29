<?php
declare(strict_types=1);

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to user, log them instead
ini_set('log_errors', 1);

require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/core/Helpers.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/EmployeeController.php';

// CORS setup
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = getCleanUri();

error_log("Request: $method $uri");

try {
    switch ($uri) {
        case '/api/login':
            if ($method === 'POST') {
                (new AuthController())->login();
            } elseif ($method === 'GET') {
                respondJson(200, [
                    'message' => 'Login endpoint is ready',
                    'method' => 'POST',
                    'expected_body' => [
                        'email' => 'string',
                        'password' => 'string'
                    ]
                ]);
            } else {
                respondJson(405, ['error' => 'Method Not Allowed']);
            }
            break;

       case '/api/employees':
    if ($method === 'GET') {
        $id = $_GET['id'] ?? null;
        $controller = new EmployeeController();
        if ($id) {
            $controller->getById((int)$id);
        } else {
            $controller->getAll();
        }
    } else {
        respondJson(405, ['error' => 'Method Not Allowed']);
    }
    break;


        case '/debug':
            respondJson(200, [
                'status' => 'success',
                'message' => 'Backend is working!',
                'debug_info' => [
                    'original_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
                    'processed_uri' => $uri,
                    'method' => $method,
                    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'N/A',
                    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
                    'php_version' => PHP_VERSION,
                    'extensions' => [
                        'pdo' => extension_loaded('pdo'),
                        'pdo_mysql' => extension_loaded('pdo_mysql'),
                        'json' => extension_loaded('json'),
                    ]
                ]
            ]);
            break;

        default:
            respondJson(404, [
                'error' => 'Route Not Found',
                'requested_uri' => $uri,
                'available_routes' => [
                    '/api/login (POST, GET)',
                    '/api/employees (GET)',
                    '/debug (GET)'
                ]
            ]);
            break;
    }
} catch (Throwable $e) {
    error_log("Fatal error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    respondJson(500, [
        'error' => 'Internal server error',
        'message' => $e->getMessage() // Remove this in production
]);
}