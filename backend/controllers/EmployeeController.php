<?php
class EmployeeController {
    
    private function getAuthToken(): ?string {
        $headers = [
            $_SERVER['HTTP_AUTHORIZATION'] ?? '',
            $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '',
            getallheaders()['Authorization'] ?? '',
            getallheaders()['authorization'] ?? ''
        ];
        
        foreach ($headers as $header) {
            if (!empty($header) && stripos($header, 'Bearer ') === 0) {
                return trim(substr($header, 7));
            }
        }
        
        return null;
    }
    
    private function verifyAuth(): ?array {
        $token = $this->getAuthToken();
        
        if (!$token) {
            error_log("No authorization token found");
            return null;
        }
        
        error_log("Token found: " . substr($token, 0, 50) . '...');
        
        $userData = verifyToken($token);
        
        if (!$userData) {
            error_log("Token verification failed");
            return null;
        }
        
        error_log("Token verified successfully for user: " . json_encode($userData));
        return $userData;
    }

    public function getById(int $id): void {
        try {
            $userData = $this->verifyAuth();
            if (!$userData) {
                respondJson(401, ['error' => 'Unauthorized - Invalid or missing token']);
                return;
            }
            
            error_log("Fetching employee with ID: $id for user: " . json_encode($userData));
            
            $db = getDatabaseConnection();
            if (!$db) {
                respondJson(500, ['error' => 'Database connection failed']);
                return;
            }

            $stmt = $db->prepare("SELECT id, full_name, email, role, phone, salary_type, salary_per_session, salary_fixed, created_at 
                                  FROM employees WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $employee = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$employee) {
                error_log("Employee not found with ID: $id");
                respondJson(404, ['error' => 'Employee not found']);
                return;
            }

            // ✅ تحويل البيانات للنوع الصحيح
            $employee['id'] = (int)$employee['id'];
            if ($employee['salary_per_session'] !== null) {
                $employee['salary_per_session'] = (float)$employee['salary_per_session'];
            }
            if ($employee['salary_fixed'] !== null) {
                $employee['salary_fixed'] = (float)$employee['salary_fixed'];
            }

            error_log("Employee found: " . json_encode($employee));
            respondJson(200, ['employee' => $employee]);

        } catch (Exception $e) {
            error_log("Error fetching employee: " . $e->getMessage());
            respondJson(500, ['error' => 'Failed to fetch employee data']);
        }
    }

    public function getAll(): void {
        try {
            $userData = $this->verifyAuth();
            if (!$userData) {
                respondJson(401, ['error' => 'Unauthorized - Invalid or missing token']);
                return;
            }
            
            error_log("Fetching all employees for user: " . json_encode($userData));

            $db = getDatabaseConnection();
            if (!$db) {
                respondJson(500, ['error' => 'Database connection failed']);
                return;
            }

            $stmt = $db->query("SELECT id, full_name, email, role, phone, salary_type, salary_per_session, salary_fixed, created_at 
                               FROM employees ORDER BY full_name ASC");
            $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ تحويل البيانات للنوع الصحيح
            foreach ($employees as &$employee) {
                $employee['id'] = (int)$employee['id'];
                if ($employee['salary_per_session'] !== null) {
                    $employee['salary_per_session'] = (float)$employee['salary_per_session'];
                }
                if ($employee['salary_fixed'] !== null) {
                    $employee['salary_fixed'] = (float)$employee['salary_fixed'];
                }
            }

            error_log("Found " . count($employees) . " employees");
            respondJson(200, $employees);

        } catch (Exception $e) {
            error_log("Error fetching employees: " . $e->getMessage());
            respondJson(500, ['error' => 'Failed to fetch employees data']);
        }
    }
    
    public function create(): void {
        try {
            $userData = $this->verifyAuth();
            if (!$userData) {
                respondJson(401, ['error' => 'Unauthorized - Invalid or missing token']);
                return;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                respondJson(400, ['error' => 'Invalid JSON data']);
                return;
            }
            
            $required = ['full_name', 'email', 'phone', 'salary_type'];
            foreach ($required as $field) {
                if (empty($input[$field])) {
                    respondJson(400, ['error' => "Field '$field' is required"]);
                    return;
                }
            }
            
            $db = getDatabaseConnection();
            if (!$db) {
                respondJson(500, ['error' => 'Database connection failed']);
                return;
            }
            

            $stmt = $db->prepare("INSERT INTO employees (full_name, email, phone, salary_type, salary_per_session, salary_fixed, role) 
                                  VALUES (:full_name, :email, :phone, :salary_type, :salary_per_session, :salary_fixed, :role)");
            
            $result = $stmt->execute([
                ':full_name' => $input['full_name'],
                ':email' => $input['email'],
                ':phone' => $input['phone'],
                ':salary_type' => $input['salary_type'],
                ':salary_per_session' => $input['salary_per_session'] ?? 0,
                ':salary_fixed' => $input['salary_fixed'] ?? 0,
                ':role' => $input['role'] ?? 'employee'
            ]);
            
            if ($result) {
                $newId = $db->lastInsertId();
                respondJson(201, ['success' => true, 'employee_id' => (int)$newId, 'message' => 'Employee created successfully']);
            } else {
                respondJson(500, ['error' => 'Failed to create employee']);
            }
            
        } catch (Exception $e) {
            error_log("Error creating employee: " . $e->getMessage());
            respondJson(500, ['error' => 'Failed to create employee']);
        }
    }
    
    public function update(int $id): void {
        try {
            $userData = $this->verifyAuth();
            if (!$userData) {
                respondJson(401, ['error' => 'Unauthorized - Invalid or missing token']);
                return;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                respondJson(400, ['error' => 'Invalid JSON data']);
                return;
            }
            
            $db = getDatabaseConnection();
            if (!$db) {
                respondJson(500, ['error' => 'Database connection failed']);
                return;
            }
            
        
            $stmt = $db->prepare("UPDATE employees SET 
                                  full_name = :full_name, 
                                  email = :email, 
                                  phone = :phone, 
                                  salary_type = :salary_type, 
                                  salary_per_session = :salary_per_session, 
                                  salary_fixed = :salary_fixed,
                                  role = :role
                                  WHERE id = :id");
            
            $result = $stmt->execute([
                ':id' => $id,
                ':full_name' => $input['full_name'],
                ':email' => $input['email'],
                ':phone' => $input['phone'],
                ':salary_type' => $input['salary_type'],
                ':salary_per_session' => $input['salary_per_session'] ?? 0,
                ':salary_fixed' => $input['salary_fixed'] ?? 0,
                ':role' => $input['role'] ?? 'employee'
            ]);
            
            if ($result) {
                respondJson(200, ['success' => true, 'message' => 'Employee updated successfully']);
            } else {
                respondJson(500, ['error' => 'Failed to update employee']);
            }
            
        } catch (Exception $e) {
            error_log("Error updating employee: " . $e->getMessage());
            respondJson(500, ['error' => 'Failed to update employee']);
        }
    }
    
    public function delete(int $id): void {
        try {
            $userData = $this->verifyAuth();
            if (!$userData) {
                respondJson(401, ['error' => 'Unauthorized - Invalid or missing token']);
                return;
            }
            
            $db = getDatabaseConnection();
            if (!$db) {
                respondJson(500, ['error' => 'Database connection failed']);
                return;
            }
            
            $stmt = $db->prepare("DELETE FROM employees WHERE id = :id");
            $result = $stmt->execute([':id' => $id]);
            
            if ($result && $stmt->rowCount() > 0) {
                respondJson(200, ['success' => true, 'message' => 'Employee deleted successfully']);
            } else {
                respondJson(404, ['error' => 'Employee not found']);
            }
            
        } catch (Exception $e) {
            error_log("Error deleting employee: " . $e->getMessage());
            respondJson(500, ['error' => 'Failed to delete employee']);
        }
    }
}