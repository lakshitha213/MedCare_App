package lk.ac.med.medcare.medcare.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "channelings")
public class Channeling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String userName;
    private String userProfileImage;
    private String userTelephone;
    private String doctorName;
    private String channelingName;
    private String date;
    private String time;
    private String status = "pending";
}
