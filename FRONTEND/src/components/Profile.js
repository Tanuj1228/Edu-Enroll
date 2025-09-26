import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import CourseService from "../services/course.service";
import UserService from "../services/user.service";
import StudentService from "../services/student.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // 🔹 Fetch all courses
  useEffect(() => {
    CourseService.getAllCourses().then(
      (response) => setCourses(response.data),
      (error) => console.log("Error fetching courses: ", error)
    );
  }, []);

  // 🔹 Fetch logged-in student profile (enrolledCourses)
  useEffect(() => {
    if (currentUser) {
      StudentService.getMyProfile().then(
        (res) => {
          setEnrolledCourses(res.data.enrolledCourses || []);
        },
        (error) => {
          console.log("Error fetching student profile: ", error);
        }
      );
    }
  }, [currentUser]);

  const handleEnroll = (courseId) => {
    UserService.enrollInCourse(courseId).then(
      () => {
        setMessage(`✅ Successfully enrolled in course ID: ${courseId}`);

        // 🔹 Update state + localStorage user
        const updatedCourses = [...enrolledCourses, courseId];
        setEnrolledCourses(updatedCourses);

        const updatedUser = {
          ...currentUser,
          enrolledCourses: updatedCourses,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      },
      (error) => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.";
        setMessage(`❌ Failed to enroll. Error: ${errorMessage}`);
      }
    );
  };

  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-warning text-center shadow-lg p-4">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Profile Header */}
      <header className="bg-primary text-white p-5 rounded-4 shadow-lg mb-5 text-center">
        <h2 className="fw-bold">👋 Welcome, {currentUser.username}!</h2>
        <p className="lead mb-0">Manage your courses and profile here.</p>
      </header>

      {/* User Info */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="fw-bold text-primary">User Information</h5>
              <p className="mb-1">
                <strong>Email:</strong> {currentUser.email}
              </p>
              <p className="mb-0">
                <strong>Roles:</strong>
              </p>
              <ul className="list-group list-group-flush">
                {currentUser.roles &&
                  currentUser.roles.map((role, index) => (
                    <li key={index} className="list-group-item">
                      {role}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <h3 className="fw-bold text-center mb-4">📚 Available Courses</h3>

      {message && (
        <div className="alert alert-info text-center shadow-sm">{message}</div>
      )}

      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-lg border-0 course-card">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{course.courseName}</h5>
                <p className="card-text flex-grow-1">
                  {course.description} <br />
                  <em className="text-muted">by {course.instructor}</em>
                </p>
                <button
                  className="btn btn-success mt-auto w-100"
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrolledCourses.includes(course.id)} // ✅ backend synced state
                >
                  {enrolledCourses.includes(course.id)
                    ? "✅ Enrolled"
                    : "📚 Enroll"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom CSS for hover effects */}
      <style>{`
        .course-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .course-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default Profile;
