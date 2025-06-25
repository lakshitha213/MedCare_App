package lk.ac.med.medcare.medcare.controller;

import lk.ac.med.medcare.medcare.service.ImageUploadService;
import lk.ac.med.medcare.medcare.dto.LoginRequest;
import lk.ac.med.medcare.medcare.model.User;
import lk.ac.med.medcare.medcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @PostMapping(value = "/signup", consumes = { "multipart/form-data" })
    public ResponseEntity<?> signup(
            @RequestParam("firstName") String firstName,
            @RequestParam("secondName") String secondName,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("confirmPassword") String confirmPassword,
            @RequestParam("address") String address,
            @RequestParam("birthdate") String birthdate,
            @RequestParam("telephone") String telephone,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        System.out
                .println("Received image: " + (profileImage != null ? profileImage.getOriginalFilename() : "No image"));

        try {
            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("Email is already in use!");
            }

            String imageUrl = null;
            if (profileImage != null && !profileImage.isEmpty()) {
                imageUrl = imageUploadService.uploadImage(profileImage);
            }

            // Create new user
            User user = new User();
            user.setFirstName(firstName);
            user.setSecondName(secondName);
            user.setEmail(email);
            user.setPassword(password); // Note: In production, encrypt this password
            user.setAddress(address);
            user.setBirthdate(birthdate);
            user.setTelephone(telephone);
            user.setProfileImage(imageUrl);
            user.setRole("USER");

            System.out.println("==== Incoming Form Data ====");
            System.out.println("First Name: " + firstName);
            System.out.println("Second Name: " + secondName);
            System.out.println("Email: " + email);
            System.out.println("Password: " + password);
            System.out.println("Confirm Password: " + confirmPassword);
            System.out.println("Address: " + address);
            System.out.println("Birthdate: " + birthdate);
            System.out.println("Telephone: " + telephone);
            System.out
                    .println("Received Image: " + (profileImage != null ? profileImage.getOriginalFilename() : "null"));
            System.out.println("============================");

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