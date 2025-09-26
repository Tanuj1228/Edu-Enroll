package com.college.project.course_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity // Tells Hibernate to make a table out of this class
@Data   // Lombok annotation to create getters, setters, toString(), etc. automatically
public class Course {

    @Id // Marks this as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments the ID
    private Long id;
    private String courseName;
    private String description;
    private String instructor;
}