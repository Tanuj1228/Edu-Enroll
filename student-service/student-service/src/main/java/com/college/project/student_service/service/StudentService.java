package com.college.project.student_service.service;

import com.college.project.student_service.entity.Student;
import com.college.project.student_service.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate; // ✅ Added to query course popularity

    @Transactional
    public void enroll(String username, Long courseId) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: Student not found."));

        // ✅ Prevent duplicate enrollment
        if (student.getEnrolledCourses().contains(courseId)) {
            throw new RuntimeException("Already enrolled in this course");
        }

        student.getEnrolledCourses().add(courseId);
        studentRepository.save(student);
    }

    // 🔹 Fetch all students with their enrolled courses
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // 🔹 Remove a course from all students (when course is deleted by Admin)
    @Transactional
    public void removeCourseFromAllStudents(Long courseId) {
        List<Student> students = studentRepository.findAll();

        for (Student student : students) {
            if (student.getEnrolledCourses().contains(courseId)) {
                student.getEnrolledCourses().remove(courseId);
                studentRepository.save(student);
            }
        }
    }

    // 🔹 Get course popularity for CourseService
    public Map<Long, Long> getCoursePopularity() {
        Map<Long, Long> popularityMap = new HashMap<>();
        String sql = "SELECT course_id, COUNT(student_id) AS enrolled_count " +
                "FROM student_enrolled_courses GROUP BY course_id";

        jdbcTemplate.query(sql, rs -> {
            popularityMap.put(rs.getLong("course_id"), rs.getLong("enrolled_count"));
        });

        return popularityMap;
    }
}
