package com.college.project.course_service.repository;

import com.college.project.course_service.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // That's it! Spring Data JPA provides all basic CRUD operations.
}