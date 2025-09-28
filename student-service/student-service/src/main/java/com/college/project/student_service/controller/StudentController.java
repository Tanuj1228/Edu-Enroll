package com.college.project.student_service.controller;

import com.college.project.student_service.entity.Student;
import com.college.project.student_service.payload.MessageResponse;
import com.college.project.student_service.repository.StudentRepository;
import com.college.project.student_service.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate; // ✅ added JdbcTemplate for raw SQL queries

    @PostMapping("/enroll/{courseId}")
    @PreAuthorize("hasRole('USER')") // This annotation ensures only users with ROLE_USER can access it
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        studentService.enroll(username, courseId);
        return ResponseEntity.ok(new MessageResponse("Enrolled successfully in course " + courseId));
    }

    // 🔹 Endpoint for admin to view all students and their enrolled courses
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // 🔹 NEW endpoint for course_service to call when a course is deleted
    @DeleteMapping("/remove-course/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeCourseFromStudents(@PathVariable Long courseId) {
        studentService.removeCourseFromAllStudents(courseId);
        return ResponseEntity.ok(new MessageResponse("Course removed from all students"));
    }

    // 🔹 NEW endpoint: Get logged-in student's profile (with enrolledCourses)
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Student> getMyProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: Student not found."));

        return ResponseEntity.ok(student);
    }

    // 🔹 NEW endpoint: Get course popularity (for CourseService)
    @GetMapping("/course-popularity")
    public ResponseEntity<Map<Long, Long>> getCoursePopularity() {

        String sql = "SELECT course_id, COUNT(student_id) AS enrolled_count " +
                "FROM student_enrolled_courses " +
                "GROUP BY course_id " +
                "ORDER BY enrolled_count DESC";
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);

        Map<Long, Long> popularityMap = new HashMap<>();
        for (Map<String, Object> row : results) {
            Long courseId = ((Number) row.get("course_id")).longValue();
            Long count = ((Number) row.get("enrolled_count")).longValue();
            popularityMap.put(courseId, count);
        }

        return ResponseEntity.ok(popularityMap);
    }
}
