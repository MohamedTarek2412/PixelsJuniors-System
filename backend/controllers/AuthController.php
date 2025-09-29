<?php
class AuthController {
    public function login(): void {
        try {
            // Enable error logging for debugging
            error_log("Login attempt started");
            
            $input = readJsonBody();
            error_log("Input received: " . json_encode($input));
            
            if (!$input || empty($input['email']) || empty($input['password'])) {
                error_log("Missing email or password");
                respondJson(400, ['error' => 'Email and password are required']);
                return;
            }

            $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
            $password = $input['password'];

            if (!$email) {
                error_log("Invalid email format: " . $input['email']);
                respondJson(400, ['error' => 'Invalid email format']);
                return;
            }

            $db = getDatabaseConnection();
            if (!$db) {
                error_log("Database connection failed");
                respondJson(500, ['error' => 'Database connection failed']);
                return;
            }

            error_log("Database connected successfully");

            // Check if the employees table exists and has data
            try {
                $stmt = $db->prepare("SELECT id, full_name, email, role, password FROM employees WHERE email = :email LIMIT 1");
                $stmt->execute([':email' => $email]);
                $userRow = $stmt->fetch(PDO::FETCH_ASSOC);
                
                error_log("User query result: " . ($userRow ? "found" : "not found"));
            } catch (PDOException $e) {
                error_log("Database query error: " . $e->getMessage());
                respondJson(500, ['error' => 'Database query failed']);
                return;
            }

            if (!$userRow) {
                error_log("User not found with email: " . $email);
                respondJson(401, ['error' => 'Invalid credentials']);
                return;
            }

            // Password verification
            $isPasswordValid = false;
            
            if (password_verify($password, $userRow['password'])) {
                $isPasswordValid = true;
                error_log("Password verified successfully (hashed)");
                
                if (password_needs_rehash($userRow['password'], PASSWORD_ARGON2ID)) {
                    $newHash = password_hash($password, PASSWORD_ARGON2ID);
                    $upd = $db->prepare("UPDATE employees SET password = :ph WHERE id = :id");
                    $upd->execute([':ph' => $newHash, ':id' => $userRow['id']]);
                    error_log("Password rehashed for user: " . $email);
                }
            } elseif ($password === $userRow['password']) {
                $isPasswordValid = true;
                error_log("Plain text password matched (will be hashed)");
                
                $hashedPassword = password_hash($password, PASSWORD_ARGON2ID);
                $upd = $db->prepare("UPDATE employees SET password = :ph WHERE id = :id");
                $upd->execute([':ph' => $hashedPassword, ':id' => $userRow['id']]);
                error_log("Plain text password converted to hash for user: " . $email);
            }

            if (!$isPasswordValid) {
                error_log("Password verification failed for user: " . $email);
                respondJson(401, ['error' => 'Invalid credentials']);
                return;
            }

            $user = [
                'id' => (int)$userRow['id'],
                'full_name' => $userRow['full_name'],
                'email' => $userRow['email'],
                'role' => $userRow['role']
            ];

            $payload = [
                'user_id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role'],
                'exp' => time() + 3600
            ];
            
            $token = createToken($payload);
            
            error_log("Login successful for user: " . $email);

            respondJson(200, [
                'token' => $token,
                'user' => $user
            ]);

        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
            respondJson(500, ['error' => 'Internal server error: ' . $e->getMessage()]);
        } catch (Error $e) {
            error_log("Login fatal error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
            respondJson(500, ['error' => 'Fatal error occurred']);
        }
    }
}
