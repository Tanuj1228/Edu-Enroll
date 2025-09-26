package com.college.project.student_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "students")
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;

    // A student can have multiple roles (e.g., be a user and an admin)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "student_roles",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    // This will store the IDs of the courses the student is enrolled in.
    // This is how we handle the Many-to-Many with Courses in a microservice architecture.
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_enrolled_courses", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "course_id")
    private Set<Long> enrolledCourses = new HashSet<>();
}