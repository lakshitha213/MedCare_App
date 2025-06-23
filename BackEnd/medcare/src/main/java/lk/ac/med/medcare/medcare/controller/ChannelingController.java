package lk.ac.med.medcare.medcare.controller;

import lk.ac.med.medcare.medcare.model.Channeling;
import lk.ac.med.medcare.medcare.repository.ChannelingRepository;
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

    @PostMapping("/add")
    public ResponseEntity<?> addChanneling(@RequestBody Channeling channeling) {
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
}