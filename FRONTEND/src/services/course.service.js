import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8081/api/courses';

const getAllCourses = () => {
  return axios.get(API_URL, { headers: authHeader() }); // ✅ include token if logged in
};

// Admin-only functions
const addCourse = (courseName, description, instructor) => {
  return axios.post(
    API_URL,
    {
      courseName,
      description,
      instructor,
    },
    { headers: authHeader() }
  );
};

const deleteCourse = (id) => {
  return axios.delete(API_URL + `/${id}`, { headers: authHeader() });
};

const updateCourse = (id, courseName, description, instructor) => {
  return axios.put(
    API_URL + `/${id}`,
    { courseName, description, instructor },
    { headers: authHeader() }
  );
};

const CourseService = {
  getAllCourses,
  addCourse,
  deleteCourse,
  updateCourse, 
};

export default CourseService;
