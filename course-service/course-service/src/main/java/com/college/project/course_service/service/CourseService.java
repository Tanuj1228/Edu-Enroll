package com.college.project.course_service.service;

import com.college.project.course_service.entity.Course;
import com.college.project.course_service.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

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

    // ✅ Add a new course
    public Course addCourse(Course course) {
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
    // ✅ Update course details
    public Course updateCourse(Long id, Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            course.setCourseName(updatedCourse.getCourseName());
            course.setDescription(updatedCourse.getDescription());
            course.setInstructor(updatedCourse.getInstructor());
            return courseRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Course not found with id " + id));
    }

}
