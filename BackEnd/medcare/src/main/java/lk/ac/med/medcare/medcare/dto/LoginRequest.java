package lk.ac.med.medcare.medcare.dto;

public class LoginRequest {
    private String email;
    private String password;

    // Default constructor
    public LoginRequest() {
    }

    // Constructor with fields
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
} 