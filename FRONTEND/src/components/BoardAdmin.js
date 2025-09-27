import React, { useState, useEffect } from "react";
import CourseService from "../services/course.service";
import StudentService from "../services/student.service";

const BoardAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [message, setMessage] = useState("");

  // NEW STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Fetch Courses
  const fetchCourses = () => {
    setLoading(true);
    CourseService.getAllCourses().then((response) => {
      setCourses(response.data);
      setLoading(false);
    });
  };

  // Fetch Students
  const fetchStudents = () => {
    setLoading(true);
    StudentService.getAllStudents().then((response) => {
      setStudents(response.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  // Add Course
  const handleAddCourse = (e) => {
    e.preventDefault();
    setMessage("");

    if (editingCourse) {
      CourseService.updateCourse(
        editingCourse.id,
        courseName,
        description,
        instructor
      ).then(
        () => {
          fetchCourses();
          setEditingCourse(null);
          setCourseName("");
          setDescription("");
          setInstructor("");
          setMessage("✅ Course updated successfully!");
        },
        () => setMessage("❌ Failed to update course.")
      );
    } else {
      CourseService.addCourse(courseName, description, instructor).then(
        () => {
          fetchCourses();
          setCourseName("");
          setDescription("");
          setInstructor("");
          setMessage("✅ Course added successfully!");
        },
        () => setMessage("❌ Failed to add course.")
      );
    }
  };

  // Delete Course
  const handleDeleteCourse = (id) => {
    CourseService.deleteCourse(id).then(
      () => fetchCourses(),
      () => setMessage("❌ Failed to delete course.")
    );
  };

  // Edit Course
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseName(course.courseName);
    setDescription(course.description);
    setInstructor(course.instructor);
    setMessage("✏️ Editing course: " + course.courseName);
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingCourse(null);
    setCourseName("");
    setDescription("");
    setInstructor("");
    setMessage("❌ Edit cancelled.");
  };

  // Search filter
  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="d-flex">
      {/* ✅ Sidebar */}
      <nav
  className="text-white p-3 position-fixed d-flex flex-column align-items-center sidebar"
  style={{
    width: "180px",           // smaller width
    top: "50%",               // vertically center
    left: "10px",             // distance from left edge
    transform: "translateY(-50%)", // exact vertical centering
    backgroundColor: "rgba(0,0,0,0.6)", // semi-transparent
    borderRadius: "12px",     // rounded corners
    backdropFilter: "blur(8px)", // frosted glass
    zIndex: 1000,
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)" // subtle shadow
  }}
>
  <h5 className="fw-bold mb-4 text-center">Admin Panel</h5>
  <ul className="nav flex-column gap-2 w-100 text-center">
    <li className="nav-item">
      <a href="#top" className="nav-link text-white d-flex align-items-center justify-content-center">
        <span className="icon">🏠</span> Add Courses
      </a>
    </li>
    <li className="nav-item">
      <a href="#courses" className="nav-link text-white d-flex align-items-center justify-content-center">
        <span className="icon">📚</span> Courses
      </a>
    </li>
    <li className="nav-item">
      <a href="#students" className="nav-link text-white d-flex align-items-center justify-content-center">
        <span className="icon">👩‍🎓</span> Students
      </a>
    </li>
  </ul>

  {/* Hover CSS */}
  <style jsx>{`
    .sidebar .nav-link {
      position: relative;
      padding: 10px 12px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .sidebar .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.15); /* highlight background */
      border-left: 4px solid #0d6efd;             /* border highlight */
      transform: translateX(5px);                 /* slight move effect */
    }

    .sidebar .nav-link .icon {
      display: inline-block;
      margin-right: 6px;
      transition: transform 0.3s ease;
    }

    .sidebar .nav-link:hover .icon {
      transform: rotate(20deg) scale(1.2); /* icon animation */
    }
  `}</style>
</nav>



      {/* ✅ Main Content */}
      <div className="container py-5" style={{ marginLeft: "150px" }}>
        {/* Dashboard Header */}
        <header id="top" className="bg-dark text-white text-center p-5 rounded-4 shadow-lg mb-5">
          <h2 className="fw-bold">⚙️ Admin Dashboard</h2>
          <p className="lead">Manage courses and students with ease</p>
        </header>

        {/* Add / Update Course Section */}
        <div className="card shadow-lg border-0 p-4 mb-5">
          <h4 className="fw-bold text-primary mb-4">
            {editingCourse ? "✏️ Edit Course" : "➕ Add New Course"}
          </h4>
          <form onSubmit={handleAddCourse}>
            <div  className="form-group mb-3">
              <label className="fw-semibold">Course Name</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="e.g. Java Essentials"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label className="fw-semibold">Description</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="A brief summary of the course"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label className="fw-semibold">Instructor</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="e.g. Prof. Smith"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                required
              />
            </div>

            <div className="d-flex gap-2" id="courses" >
              <button type="submit" className="btn btn-success btn-lg w-100">
                {editingCourse ? "💾 Update Course" : "✅ Add Course"}
              </button>
              {editingCourse && (
                <button
                  
                  type="button"
                  className="btn btn-secondary btn-lg w-50"
                  onClick={handleCancelEdit}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
          {message && (
            <div  className="alert alert-info text-center mt-4">{message}</div>
          )}
        </div>

        {/* Manage Courses */}
        <h4 className="fw-bold text-center mb-4">📚 Manage Existing Courses</h4>

        <div className="mb-4" >
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="🔍 Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading && <p className="text-center">⏳ Loading...</p>}

        <div className="row">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card course-card shadow-sm h-100 border-0">
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-bold">{course.courseName}</h5>
                    <p className="text-muted flex-grow-1">{course.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-secondary">
                        👨‍🏫 {course.instructor}
                      </small>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEditCourse(course)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">❌ No courses found</p>
          )}
        </div>

        {/* Manage Students */}
        <hr className="my-5" />
        <h4 id="students" className="fw-bold text-center mb-4">
          👩‍🎓 Manage Students
        </h4>

        <div className="d-flex justify-content-end mb-3">
          <button onClick={fetchStudents} className="btn btn-primary">
            🔄 Refresh Students
          </button>
        </div>

        <div className="table-responsive shadow-sm">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.username}</td>
                  <td>{student.email}</td>
                  <td>
                    {student.roles?.map((role, idx) => (
                      <span key={idx} className="badge bg-primary me-1">
                        {role.name.replace("ROLE_", "")}
                      </span>
                    ))}
                  </td>
                  <td className="d-flex flex-wrap">
                    {student.enrolledCourses &&
                    student.enrolledCourses.length > 0 ? (
                      student.enrolledCourses.map((courseId) => {
                        const course = courses.find((c) => c.id === courseId);
                        return course ? (
                          <span
                            key={courseId}
                            className="badge bg-success me-1 mb-1"
                          >
                            {course.courseName}
                          </span>
                        ) : (
                          <span
                            key={courseId}
                            className="badge bg-secondary me-1 mb-1"
                          >
                            Unknown (ID: {courseId})
                          </span>
                        );
                      })
                    ) : (
                      "Not Enrolled"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hover effect for course cards */}
        <style>{`
          .course-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .course-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 20px rgba(0,0,0,0.15);
          }
          input:focus {
            border-color: #0d6efd !important;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default BoardAdmin;
