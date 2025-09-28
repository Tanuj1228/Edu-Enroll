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

import java.util.*;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String STUDENT_SERVICE_URL = "http://localhost:8080/api/student";

    // ✅ Get all courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // ✅ Get course by ID (new)
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        return ResponseEntity.ok(course);
    }

    // ✅ Add new course (Admin only)
    @PostMapping
    public ResponseEntity<?> addCourse(@RequestBody Course course) {
        if (courseRepository.findByCourseNameIgnoreCase(course.getCourseName()).isPresent()) {
            return ResponseEntity.badRequest().body("Course with name '" + course.getCourseName() + "' already exists.");
        }

        int professorCourseCount = courseRepository.countByInstructorIgnoreCase(course.getInstructor());
        if (professorCourseCount >= 3) {
            return ResponseEntity.badRequest().body("Professor '" + course.getInstructor() + "' is already assigned to 3 courses.");
        }

        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    // ✅ Update course details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        Optional<Course> existingCourseOpt = courseRepository.findById(id);

        if (existingCourseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        courseRepository.findByCourseNameIgnoreCase(updatedCourse.getCourseName())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new RuntimeException("Course with name '" + updatedCourse.getCourseName() + "' already exists.");
                });

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

    // ✅ Delete course + remove from students
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
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

        courseRepository.deleteById(id);

        return ResponseEntity.ok("Course deleted successfully and removed from students");
    }

    // ✅ Get courses sorted by popularity (from Student Service)
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularCourses(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<Course> courses = courseRepository.findAll();
        Map<Long, Long> popularityMap = new HashMap<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            if (authHeader != null) {
                headers.set("Authorization", authHeader);
            }

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    STUDENT_SERVICE_URL + "/course-popularity",
                    HttpMethod.GET,
                    requestEntity,
                    Map.class
            );

            if (response.getBody() != null) {
                for (Object key : response.getBody().keySet()) {
                    Long courseId = Long.valueOf(key.toString());
                    Long count = Long.valueOf(response.getBody().get(key).toString());
                    popularityMap.put(courseId, count);
                }
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching popularity: " + e.getMessage());
        }

        // Build result list
        List<Map<String, Object>> result = new ArrayList<>();
        for (Course course : courses) {
            Map<String, Object> data = new HashMap<>();
            data.put("id", course.getId());
            data.put("courseName", course.getCourseName());
            data.put("description", course.getDescription());
            data.put("instructor", course.getInstructor());
            data.put("enrolledCount", popularityMap.getOrDefault(course.getId(), 0L));
            result.add(data);
        }

        // Sort by popularity
        result.sort((a, b) -> ((Long) b.get("enrolledCount")).compareTo((Long) a.get("enrolledCount")));

        return ResponseEntity.ok(result);
    }
}
