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

const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'getme', config);
  return response.data;
};

const getUsers = async () => {
  const response = await axios.get(API_URL + 'getusers');
  return response.data;
};

// getClinic, updateClinic

const userService = {
  login,
  register,
  logout,
  createClinic,
  getMe,
  getUsers,
};

export default userService;
