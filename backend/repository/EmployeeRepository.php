<?php
declare(strict_types=1);

namespace backend\repository;

use backend\config\Database;
use backend\model\Employee;
use PDO;
use PDOException;
use RuntimeException;

final class EmployeeRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(Employee $employee): int {
        try {
            $sql = "INSERT INTO employees (full_name, email, password, role, phone, salary_type, salary_per_session, salary_fixed, created_at)
                    VALUES (:full_name, :email, :password, :role, :phone, :salary_type, :salary_per_session, :salary_fixed, :created_at)";
            $stmt = $this->db->prepare($sql);
            $data = $employee->toArray();
            $data['password'] = $employee->getPassword() ? password_hash($employee->getPassword(), PASSWORD_ARGON2ID) : null;
            $stmt->execute($data);
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new RuntimeException("Failed to create employee: " . $e->getMessage());
        }
    }

    public function findById(int $id): ?Employee {
        try {
            $sql = "SELECT * FROM employees WHERE id = :id LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':id' => $id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row ? Employee::fromArray($row) : null;
        } catch (PDOException $e) {
            throw new RuntimeException("Failed to fetch employee: " . $e->getMessage());
        }
    }

    public function findByEmail(string $email): ?Employee {
        try {
            $sql = "SELECT * FROM employees WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':email' => $email]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row ? Employee::fromArray($row) : null;
        } catch (PDOException $e) {
            throw new RuntimeException("Failed to fetch employee by email: " . $e->getMessage());
        }
    }

    public function findAll(): array {
        try {
            $sql = "SELECT * FROM employees ORDER BY created_at DESC";
            $stmt = $this->db->query($sql);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return array_map(fn($row) => Employee::fromArray($row), $rows);
        } catch (PDOException $e) {
            throw new RuntimeException("Failed to fetch employees: " . $e->getMessage());
        }
    }

    public function update(Employee $employee): bool {
        if ($employee->getId() === null) {
            throw new RuntimeException("Employee ID required for update");
        }

        try {
            $data = $employee->toArray();
            unset($data['created_at']); // Don't update created_at
            if ($employee->getPassword()) {
                $data['password'] = password_hash($employee->getPassword(), PASSWORD_ARGON2ID);
            } else {
                unset($data['password']); // Don't update password if not provided
            }

            $sql = "UPDATE employees SET " .
                   implode(', ', array_map(fn($key) => "$key = :$key", array_keys($data))) .
                   " WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([...$data, 'id' => $employee->getId()]);
        } catch (PDOException $e) {
            throw new RuntimeException("Failed to update employee: " . $e->getMessage());
        }
    }

    public function delete(int $id): bool {
        try {
            $sql = "DELETE FROM employees WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([':id' => $id]);
        } catch (PDOException $e) {
            throw new RuntimeException("Failed to delete employee: " . $e->getMessage());
        }
    }
}