package lk.ac.med.medcare.medcare.controller;

import lk.ac.med.medcare.medcare.model.AddDoctor;
import lk.ac.med.medcare.medcare.repository.AddDoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/doctors")
public class AddDoctorController {
    @Autowired
    private AddDoctorRepository addDoctorRepository;

    private static final String UPLOAD_DIR = "uploads/doctor_photos/";

    @PostMapping("/add")
    public ResponseEntity<?> addDoctor(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String doctorId,
            @RequestParam String degree,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        AddDoctor doctor = new AddDoctor();
        doctor.setName(name);
        doctor.setCategory(category);
        doctor.setDoctorId(doctorId);
        doctor.setDegree(degree);
        doctor.setEmail(email);
        doctor.setPassword(password);

        if (photo != null && !photo.isEmpty()) {
            try {
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR, fileName);
                Files.write(filePath, photo.getBytes());
                doctor.setPhoto(filePath.toString());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Photo upload failed");
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
} 