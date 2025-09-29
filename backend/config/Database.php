<?php
declare(strict_types=1);

namespace backend\config;

use PDO;
use PDOException;

final class Database {
    private static ?PDO $instance = null;

    private function __construct() {}

    public static function getInstance(): self {
        static $db = null;
        if ($db === null) {
            $db = new self();
        }
        return $db;
    }

    public function getConnection(): PDO {
        if (self::$instance === null) {
            try {
                $host = "localhost";
                $dbname = "Pixels";
                $user = "root";
                $pass = "";
                $charset = "utf8mb4";

                $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

                self::$instance = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $e) {
                die("Database Connection Failed: " . $e->getMessage());
            }
        }

        return self::$instance;
    }
}
