package lk.ac.med.medcare.medcare.controller;

import lk.ac.med.medcare.medcare.dto.SignupRequest;
import lk.ac.med.medcare.medcare.dto.LoginRequest;
import lk.ac.med.medcare.medcare.model.User;
import lk.ac.med.medcare.medcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                return ResponseEntity.badRequest().body("Email is already in use!");
            }

            // Create new user
            User user = new User();
            user.setFirstName(signupRequest.getFirstName());
            user.setSecondName(signupRequest.getSecondName());
            user.setEmail(signupRequest.getEmail());
            user.setPassword(signupRequest.getPassword()); // Note: In production, encrypt this password
            user.setAddress(signupRequest.getAddress());
            user.setBirthdate(signupRequest.getBirthdate());
            user.setTelephone(signupRequest.getTelephone());
            user.setProfileImage(signupRequest.getProfileImage());
            user.setRole("USER");

            // Save user to database
            userRepository.save(user);

            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during registration: " + e.getMessage());
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest loginRequest) {
        try {
            // Find user by email
            User user = userRepository.findByEmail(loginRequest.getEmail());
            
            if (user == null) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }

            // Check password (Note: In production, use proper password encryption)
            if (!user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }

            // Return success response with user data
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during login: " + e.getMessage());
        }
    }

    
}