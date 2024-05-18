import axios from 'axios';
const API_URL = '/api/users/';
const API_URL_CLINIC = '/api/clinic/';

const register = async (userData) => {
  const response = await axios.post(API_URL + '', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const createClinic = async (clinicData) => {
  const response = await axios.post(API_URL_CLINIC + 'create', clinicData);
  return response.data;
};

const userService = {
  login,
  register,
  logout,
  createClinic,
};

export default userService;
