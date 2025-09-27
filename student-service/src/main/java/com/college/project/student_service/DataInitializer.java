package com.college.project.student_service;

import com.college.project.student_service.entity.ERole;
import com.college.project.student_service.entity.Role;
import com.college.project.student_service.entity.Student;
import com.college.project.student_service.repository.RoleRepository;
import com.college.project.student_service.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create ROLE_USER if not exists
        if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
            // FIX: Create the object the standard way
            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            roleRepository.save(userRole);
        }

        // Create ROLE_ADMIN if not exists
        if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
            // FIX: Create the object the standard way
            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }

        // Create admin user if not exists
        if (studentRepository.findByUsername("admin").isEmpty()) {
            Student admin = new Student();
            admin.setUsername("admin");
            admin.setEmail("admin@college.com");
            admin.setPassword(passwordEncoder.encode("admin123"));

            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Admin Role is not found."));
            roles.add(adminRole);

            admin.setRoles(roles);
            studentRepository.save(admin);
        }
    }
}