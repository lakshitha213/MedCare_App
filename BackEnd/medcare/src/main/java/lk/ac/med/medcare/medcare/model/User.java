package lk.ac.med.medcare.medcare.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String secondName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String birthdate;
    
    @Column(nullable = false)
    private String telephone;
    
    private String profileImage;
    
    @Column(nullable = false)
    private String role = "USER"; // Default role
} 