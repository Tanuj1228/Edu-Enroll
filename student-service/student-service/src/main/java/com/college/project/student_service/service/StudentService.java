package com.college.project.student_service.service;

import com.college.project.student_service.entity.Student;
import com.college.project.student_service.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

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
}
