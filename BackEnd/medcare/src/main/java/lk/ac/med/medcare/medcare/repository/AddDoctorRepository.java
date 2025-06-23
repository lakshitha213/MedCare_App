package lk.ac.med.medcare.medcare.repository;

import lk.ac.med.medcare.medcare.model.AddDoctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddDoctorRepository extends JpaRepository<AddDoctor, Long> {
    // Additional query methods if needed
} 