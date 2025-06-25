package lk.ac.med.medcare.medcare.config;

import com.cloudinary.Cloudinary;
// import com.cloudinary.utils.ObjectUtils; // Removed unused import
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dm1dyueyw");
        config.put("api_key", "329527495264743");
        config.put("api_secret", "sn0c193ZQO0dJGsXr0tCgBtqmRo");
        return new Cloudinary(config);
    }
}

