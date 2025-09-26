import axios from "axios";
import authHeader from "./auth-header";

// Student-service API
const STUDENT_API = "http://localhost:8080/api/student/";
// Course-service API
const COURSE_API = "http://localhost:8081/api/course/";

const getAllStudents = () => {
  return axios.get(STUDENT_API + "all", { headers: authHeader() });
};

const getAllCourses = () => {
  return axios.get(COURSE_API + "all", { headers: authHeader() });
};

// 🔹 Get the logged-in student's profile (with enrolledCourses)
const getMyProfile = () => {
  return axios.get(STUDENT_API + "me", { headers: authHeader() });
};

const StudentService = {
  getAllStudents,
  getAllCourses,
  getMyProfile, // ✅ added
};

export default StudentService;
