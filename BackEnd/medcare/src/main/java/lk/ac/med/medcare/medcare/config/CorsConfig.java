package lk.ac.med.medcare.medcare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow specific origins
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://localhost:8081");
        config.addAllowedOrigin("http://localhost:8082"); // Add this line
        config.addAllowedOrigin("http://10.0.2.2:8081");
        config.addAllowedOrigin("http://10.0.2.2:3000");
        config.addAllowedOrigin("http://192.168.8.103:8082"); // Add if needed
        config.addAllowedOrigin("http://172.16.21.93:8082");
        
        // Rest of your configuration remains the same
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}   