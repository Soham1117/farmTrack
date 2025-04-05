package com.ncsu.farmtrackbackend.startup;

import com.ncsu.farmtrackbackend.model.User;
import com.ncsu.farmtrackbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DefaultAdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); 
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            
        }
        
        
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123")); 
            user.setRole(User.Role.USER);
            userRepository.save(user);
            
        
        }
        
        
        if (!userRepository.existsByUsername("viewer")) {
            User viewer = new User();
            viewer.setUsername("viewer");
            viewer.setPassword(passwordEncoder.encode("viewer123")); 
            viewer.setRole(User.Role.VIEWER);
            userRepository.save(viewer);
            
        
        }
    }
}