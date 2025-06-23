package lk.ac.med.medcare.medcare.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "add_doctors")
public class AddDoctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, unique = true)
    private String doctorId;

    @Column(nullable = false)
    private String degree;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String photo; // Store file path or URL
} 