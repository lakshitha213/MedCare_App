package lk.ac.med.medcare.medcare.controller;

import lk.ac.med.medcare.medcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/db-connection")
    public ResponseEntity<?> testDbConnection() {
        try {
            // Try to count users to test database connection
            long userCount = userRepository.count();
            return ResponseEntity.ok("Database connection successful! Total users: " + userCount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Database connection failed: " + e.getMessage());
        }
    }
} 