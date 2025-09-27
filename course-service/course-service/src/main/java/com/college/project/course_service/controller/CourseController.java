package com.college.project.course_service.controller;

import com.college.project.course_service.entity.Course;
import com.college.project.course_service.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@RestController // This means it's a controller for REST APIs
@RequestMapping("/api/courses") // All endpoints in this class will start with /api/courses
@CrossOrigin(origins = "*") // Allows our React app (on a different port) to call these APIs
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    // ✅ RestTemplate to call student-service
    @Autowired
    private RestTemplate restTemplate;

    private final String STUDENT_SERVICE_URL = "http://localhost:8080/api/student"; // adjust if student-service runs on diff port

    // Endpoint to GET all courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Endpoint to ADD a new course (Admin only) with validations
    @PostMapping
    public ResponseEntity<?> addCourse(@RequestBody Course course) {
        // ✅ Check if course name already exists
        if (courseRepository.findByCourseNameIgnoreCase(course.getCourseName()).isPresent()) {
            return ResponseEntity.badRequest().body("Course with name '" + course.getCourseName() + "' already exists.");
        }

        // ✅ Check if professor is already assigned to 3 courses
        int professorCourseCount = courseRepository.countByInstructorIgnoreCase(course.getInstructor());
        if (professorCourseCount >= 3) {
            return ResponseEntity.badRequest().body("Professor '" + course.getInstructor() + "' is already assigned to 3 courses.");
        }

        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    // ✅ UPDATE endpoint (edit course details) with validations
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        Optional<Course> existingCourseOpt = courseRepository.findById(id);

        if (existingCourseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // ✅ Check if new course name already exists (other than this course)
        courseRepository.findByCourseNameIgnoreCase(updatedCourse.getCourseName())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new RuntimeException("Course with name '" + updatedCourse.getCourseName() + "' already exists.");
                });

        // ✅ Check professor course limit (ignore current course if same instructor)
        int professorCourseCount = courseRepository.countByInstructorIgnoreCase(updatedCourse.getInstructor());
        Course existingCourse = existingCourseOpt.get();
        if (!existingCourse.getInstructor().equalsIgnoreCase(updatedCourse.getInstructor()) && professorCourseCount >= 3) {
            return ResponseEntity.badRequest().body("Professor '" + updatedCourse.getInstructor() + "' is already assigned to 3 courses.");
        }

        existingCourse.setCourseName(updatedCourse.getCourseName());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setInstructor(updatedCourse.getInstructor());

        Course savedCourse = courseRepository.save(existingCourse);
        return ResponseEntity.ok(savedCourse);
    }

    // ✅ Updated DELETE endpoint (removes course from students too, with JWT forward)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        // 1. Call Student Service to remove this course from students
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            restTemplate.exchange(
                    STUDENT_SERVICE_URL + "/remove-course/" + id,
                    HttpMethod.DELETE,
                    requestEntity,
                    Void.class
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to update students when deleting course ID: " + id + " -> " + e.getMessage());
        }

        // 2. Delete the course itself
        courseRepository.deleteById(id);

        return ResponseEntity.ok("Course deleted successfully and removed from students");
    }
}
