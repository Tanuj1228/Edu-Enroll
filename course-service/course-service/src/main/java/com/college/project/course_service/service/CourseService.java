package com.college.project.course_service.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.college.project.course_service.entity.Course;
import com.college.project.course_service.repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String STUDENT_SERVICE_URL = "http://localhost:8080/api/student";

    // ✅ Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // ✅ Add a new course with validation
    public Course addCourse(Course course) {
        // 1. Check for duplicate course name
        if (courseRepository.findByCourseNameIgnoreCase(course.getCourseName()).isPresent()) {
            throw new RuntimeException("Course with name '" + course.getCourseName() + "' already exists.");
        }

        // 2. Check if professor already teaches 3 courses
        int professorCourseCount = courseRepository.countByInstructorIgnoreCase(course.getInstructor());
        if (professorCourseCount >= 3) {
            throw new RuntimeException("Professor '" + course.getInstructor() + "' is already assigned to 3 courses.");
        }

        return courseRepository.save(course);
    }

    // ✅ Delete a course and remove from all students
    public void deleteCourse(Long courseId, String adminJwtToken) {
        // 1. Remove this course from all students by calling student-service
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + adminJwtToken);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            restTemplate.exchange(
                    STUDENT_SERVICE_URL + "/remove-course/" + courseId,
                    HttpMethod.DELETE,
                    requestEntity,
                    Void.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to update students when deleting course ID: " + courseId, e);
        }

        // 2. Delete the course itself
        courseRepository.deleteById(courseId);
    }

    // ✅ Update course details with validation
    public Course updateCourse(Long id, Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            // 1. Check if new course name already exists (and is not the same course)
            courseRepository.findByCourseNameIgnoreCase(updatedCourse.getCourseName())
                    .filter(existing -> !existing.getId().equals(id))
                    .ifPresent(existing -> {
                        throw new RuntimeException("Course with name '" + updatedCourse.getCourseName() + "' already exists.");
                    });

            // 2. Check professor course limit (ignore current course being updated)
            int professorCourseCount = courseRepository.countByInstructorIgnoreCase(updatedCourse.getInstructor());
            if (!course.getInstructor().equalsIgnoreCase(updatedCourse.getInstructor()) && professorCourseCount >= 3) {
                throw new RuntimeException("Professor '" + updatedCourse.getInstructor() + "' is already assigned to 3 courses.");
            }

            // ✅ Update fields
            course.setCourseName(updatedCourse.getCourseName());
            course.setDescription(updatedCourse.getDescription());
            course.setInstructor(updatedCourse.getInstructor());
            return courseRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Course not found with id " + id));
    }
}
