package lk.ac.med.medcare.medcare.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "channelings")
public class Channeling {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String doctorName;
    private String channelingName;
    private String date;
    private String time;
}