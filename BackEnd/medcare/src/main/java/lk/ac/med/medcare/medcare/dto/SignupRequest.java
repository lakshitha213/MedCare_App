package lk.ac.med.medcare.medcare.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String firstName;
    private String secondName;
    private String email;
    private String password;
    private String confirmPassword;
    private String address;
    private String birthdate;
    private String telephone;
    private String profileImage;
}