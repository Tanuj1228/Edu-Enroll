package com.college.project.course_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.college.project.course_service.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // ✅ Check if a course already exists by name (case-insensitive)
    Optional<Course> findByCourseNameIgnoreCase(String courseName);

    // ✅ Count how many courses a professor (instructor) is already teaching
    int countByInstructorIgnoreCase(String instructor);
}
