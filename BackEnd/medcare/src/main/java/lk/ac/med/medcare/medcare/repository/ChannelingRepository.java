package lk.ac.med.medcare.medcare.repository;

import lk.ac.med.medcare.medcare.model.Channeling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelingRepository extends JpaRepository<Channeling, Long> {
    List<Channeling> findByUserEmail(String userEmail);
}