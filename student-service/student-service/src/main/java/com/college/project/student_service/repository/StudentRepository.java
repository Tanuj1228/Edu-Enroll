package com.college.project.student_service.repository;

import com.college.project.student_service.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}