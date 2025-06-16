package lk.ac.med.medcare.medcare.controller;

import lk.ac.med.medcare.medcare.model.User;
import lk.ac.med.medcare.medcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.io.IOException;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload/{email}")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable String email,
            @RequestParam("image") MultipartFile image) {
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Convert image to base64
            String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
            String imageType = image.getContentType();
            String imageData = "data:" + imageType + ";base64," + base64Image;

            // Update user's profile image
            user.setProfileImage(imageData);
            userRepository.save(user);

            return ResponseEntity.ok("Profile image updated successfully");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error uploading image: " + e.getMessage());
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getProfileImage(@PathVariable String email) {
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            String imageData = user.getProfileImage();
            if (imageData == null || imageData.isEmpty()) {
                return ResponseEntity.badRequest().body("No profile image found");
            }

            // If the image data doesn't have the data URL prefix, add it
            if (!imageData.startsWith("data:")) {
                imageData = "data:image/jpeg;base64," + imageData;
            }

            return ResponseEntity.ok(imageData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile image: " + e.getMessage());
        }
    }

}