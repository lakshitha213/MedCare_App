package lk.ac.med.medcare.medcare.controller;

import lk.ac.med.medcare.medcare.model.Channeling;
import lk.ac.med.medcare.medcare.repository.ChannelingRepository;
import lk.ac.med.medcare.medcare.repository.UserRepository;
import lk.ac.med.medcare.medcare.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/channeling")
@CrossOrigin(origins = "*")
public class ChannelingController {

    @Autowired
    private ChannelingRepository channelingRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addChanneling(@RequestBody Channeling channeling) {
        // Check if slot is already booked
        List<Channeling> existing = channelingRepository.findByDoctorNameAndDateAndTime(
            channeling.getDoctorName(), channeling.getDate(), channeling.getTime()
        );
        if (!existing.isEmpty()) {
            return ResponseEntity.status(409).body("This slot is already booked. Please choose another time or date.");
        }
        // Fetch user details using email
        User user = userRepository.findByEmail(channeling.getUserEmail());
        if (user != null) {
            String fullName = user.getFirstName() + " " + user.getSecondName();
            channeling.setUserName(fullName);
            channeling.setUserProfileImage(user.getProfileImage());
            channeling.setUserTelephone(user.getTelephone());
        }
        channelingRepository.save(channeling);
        return ResponseEntity.ok("Channeling booked successfully");
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<?> getChannelingsByUser(@PathVariable String email) {
        List<Channeling> channelings = channelingRepository.findByUserEmail(email);
        if (channelings.isEmpty()) {
            return ResponseEntity.ok().body(null);
        }
        // Return the most recent channeling (or all, as you wish)
        return ResponseEntity.ok(channelings.get(channelings.size() - 1));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteChanneling(@PathVariable Long id) {
        if (!channelingRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Channeling not found");
        }
        channelingRepository.deleteById(id);
        return ResponseEntity.ok("Channeling deleted successfully");
    }

    @GetMapping("/doctor/{doctorName}")
    public ResponseEntity<?> getAppointmentsByDoctor(@PathVariable String doctorName) {
        List<Channeling> appointments = channelingRepository.findByDoctorName(doctorName);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllChannelings() {
        List<Channeling> channelings = channelingRepository.findAll();
        return ResponseEntity.ok(channelings);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveChanneling(@PathVariable Long id) {
        Channeling channeling = channelingRepository.findById(id).orElse(null);
        if (channeling == null) {
            return ResponseEntity.status(404).body("Channeling not found");
        }
        channeling.setStatus("approved");
        channelingRepository.save(channeling);
        return ResponseEntity.ok("Channeling approved successfully");
    }

    @GetMapping("/booked-times/{doctorName}/{date}")
    public ResponseEntity<?> getBookedTimes(@PathVariable String doctorName, @PathVariable String date) {
        List<Channeling> bookings = channelingRepository.findByDoctorNameAndDate(doctorName, date);
        List<String> times = bookings.stream().map(Channeling::getTime).toList();
        return ResponseEntity.ok(times);
    }
}