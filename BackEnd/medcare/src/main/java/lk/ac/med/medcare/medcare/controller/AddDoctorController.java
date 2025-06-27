package lk.ac.med.medcare.medcare.controller;

import lk.ac.med.medcare.medcare.model.AddDoctor;
import lk.ac.med.medcare.medcare.repository.AddDoctorRepository;
import lk.ac.med.medcare.medcare.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/doctors")
public class AddDoctorController {
    @Autowired
    private AddDoctorRepository addDoctorRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @PostMapping("/add")
    public ResponseEntity<?> addDoctor(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String doctorId,
            @RequestParam String degree,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {
        AddDoctor doctor = new AddDoctor();
        doctor.setName(name);
        doctor.setCategory(category);
        doctor.setDoctorId(doctorId);
        doctor.setDegree(degree);
        doctor.setEmail(email);
        doctor.setPassword(password);

        if (photo != null && !photo.isEmpty()) {
            try {
                // Upload to Cloudinary
                String imageUrl = imageUploadService.uploadImage(photo);
                doctor.setPhoto(imageUrl);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Photo upload failed: " + e.getMessage());
            }
        }

        addDoctorRepository.save(doctor);
        return ResponseEntity.ok("Doctor added successfully");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        if (!addDoctorRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
        }
        addDoctorRepository.deleteById(id);
        return ResponseEntity.ok("Doctor deleted successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllDoctors() {
        return ResponseEntity.ok(addDoctorRepository.findAll());
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginDoctor(@RequestParam String email, @RequestParam String password) {
        System.out.println("Login attempt: email=" + email + ", password=" + password);
        AddDoctor doctor = addDoctorRepository.findByEmail(email);
        if (doctor != null) {
            System.out.println("Found doctor: email=" + doctor.getEmail() + ", password=" + doctor.getPassword());
        } else {
            System.out.println("No doctor found with email: " + email);
        }
        if (doctor != null && doctor.getPassword().equals(password)) {
            return ResponseEntity.ok(doctor);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @PutMapping("/update/{email}")
    public ResponseEntity<?> updateDoctor(@PathVariable String email, @RequestBody AddDoctor updatedDoctor) {
        AddDoctor doctor = addDoctorRepository.findByEmail(email);
        if (doctor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
        }
        doctor.setName(updatedDoctor.getName());
        doctor.setCategory(updatedDoctor.getCategory());
        doctor.setDegree(updatedDoctor.getDegree());
        doctor.setPassword(updatedDoctor.getPassword());
        // Add more fields as needed
        addDoctorRepository.save(doctor);
        return ResponseEntity.ok(doctor);
    }

    @PutMapping(value = "/update/{email}", consumes = { "multipart/form-data" })
    public ResponseEntity<?> updateDoctor(
            @PathVariable String email,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("degree") String degree,
            @RequestParam("password") String password,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        AddDoctor doctor = addDoctorRepository.findByEmail(email);
        if (doctor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
        }
        doctor.setName(name);
        doctor.setCategory(category);
        doctor.setDegree(degree);
        doctor.setPassword(password);

        if (photo != null && !photo.isEmpty()) {
            try {
                // Upload to Cloudinary or your image service
                String imageUrl = imageUploadService.uploadImage(photo);
                doctor.setPhoto(imageUrl);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Photo upload failed: " + e.getMessage());
            }
        }

        addDoctorRepository.save(doctor);
        return ResponseEntity.ok(doctor);
    }
}