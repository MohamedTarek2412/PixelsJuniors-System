<?php
declare(strict_types=1);

namespace backend\model;

use DateTimeImmutable;

final class Employee {
    public function __construct(
        private ?int $id = null,
        private string $fullName = '',
        private ?string $email = null,
        private ?string $password = null, 
        private string $role = 'employee', 
        private ?string $phone = null,
        private string $salaryType = 'monthly',
        private float $salaryPerSession = 250.00,
        private float $salaryFixed = 0.00,
        private ?DateTimeImmutable $createdAt = null
    ) {
        $this->createdAt = $createdAt ?? new DateTimeImmutable();
    }

    // Getters
    public function getId(): ?int { return $this->id; }
    public function getFullName(): string { return $this->fullName; }
    public function getEmail(): ?string { return $this->email; }
    public function getPassword(): ?string { return $this->password; }
    public function getRole(): string { return $this->role; }
    public function getPhone(): ?string { return $this->phone; }
    public function getSalaryType(): string { return $this->salaryType; }
    public function getSalaryPerSession(): float { return $this->salaryPerSession; }
    public function getSalaryFixed(): float { return $this->salaryFixed; }
    public function getCreatedAt(): DateTimeImmutable { return $this->createdAt; }

    // Convert to array for JSON response (exclude password)
    public function toArray(): array {
        return [
            'id' => $this->id,
            'full_name' => $this->fullName,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'salary_type' => $this->salaryType,
            'salary_per_session' => $this->salaryPerSession,
            'salary_fixed' => $this->salaryFixed,
            'created_at' => $this->createdAt->format('Y-m-d H:i:s'),
        ];
    }

    // Create from array (from JSON input or DB row)
    public static function fromArray(array $data): self {
        return new self(
            id: isset($data['id']) ? (int)$data['id'] : null,
            fullName: $data['full_name'] ?? $data['name'] ?? '',
            email: $data['email'] ?? null,
            password: $data['password'] ?? null,
            role: $data['role'] ?? 'employee',
            phone: $data['phone'] ?? null,
            salaryType: $data['salary_type'] ?? 'monthly',
            salaryPerSession: (float)($data['salary_per_session'] ?? 250.00),
            salaryFixed: (float)($data['salary_fixed'] ?? 0.00),
            createdAt: isset($data['created_at']) ? new DateTimeImmutable($data['created_at']) : null
        );
    }
}