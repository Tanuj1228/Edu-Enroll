import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/student/';

const enrollInCourse = (courseId) => {
  return axios.post(API_URL + `enroll/${courseId}`, {}, { headers: authHeader() });
};

const UserService = {
  enrollInCourse,
};

export default UserService;