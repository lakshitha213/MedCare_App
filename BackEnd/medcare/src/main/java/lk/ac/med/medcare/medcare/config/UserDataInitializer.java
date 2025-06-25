package lk.ac.med.medcare.medcare.config;

import lk.ac.med.medcare.medcare.model.User;
import lk.ac.med.medcare.medcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UserDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Add sample users if the table is empty
        if (userRepository.count() == 0) {
            // Sample User 1
            User user1 = new User();
            user1.setFirstName("John");
            user1.setSecondName("Doe");
            user1.setEmail("john.doe@example.com");
            user1.setPassword("password123"); // In production, this should be encrypted
            user1.setAddress("123 Main Street, City");
            user1.setBirthdate("1990-01-15");
            user1.setTelephone("1234567890");
            user1.setRole("USER");
            userRepository.save(user1);

            // Sample User 2
            User user2 = new User();
            user2.setFirstName("Jane");
            user2.setSecondName("Smith");
            user2.setEmail("jane.smith@example.com");
            user2.setPassword("password456"); // In production, this should be encrypted
            user2.setAddress("456 Oak Avenue, Town");
            user2.setBirthdate("1992-05-20");
            user2.setTelephone("9876543210");
            user2.setRole("USER");
            userRepository.save(user2);

            // Sample Admin User
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setSecondName("User");
            admin.setEmail("admin@medcare.com");
            admin.setPassword("admin123"); // In production, this should be encrypted
            admin.setAddress("789 Admin Street, City");
            admin.setBirthdate("1985-12-01");
            admin.setTelephone("5555555555");
            admin.setRole("ADMIN");
            userRepository.save(admin);

            // Custom Admin User (Username: Admin, Password: Admin12345)
            User customAdmin = new User();
            customAdmin.setFirstName("Admin");
            customAdmin.setSecondName("Admin");
            customAdmin.setEmail("admin@admin.com");
            customAdmin.setPassword("Admin12345"); // In production, this should be encrypted
            customAdmin.setAddress("Admin Address");
            customAdmin.setBirthdate("1990-01-01");
            customAdmin.setTelephone("0000000000");
            customAdmin.setRole("ADMIN");
            userRepository.save(customAdmin);
        }
    }
} 