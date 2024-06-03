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

const updateClinic = async (clinicData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL_CLINIC + 'update', clinicData, config);
  return response.data;
};

const getClinic = async () => {
  const response = await axios.get(API_URL_CLINIC + 'get');
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

const getUsers = async (token) => {
  const response = await axios.get(API_URL + 'getusers');
  return response.data;
};

const createUser = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'newuser', userData, config);
  return response.data;
};

const deleteUser = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + 'delete/' + uuid, config);
  return response.data;
};

const updateUser = async (uuid, userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log('Service: ', uuid, userData, token);
  const response = await axios.put(API_URL + 'update/' + uuid, userData, config);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const getUser = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // console.log('Service: ', uuid, token);
  const response = await axios.get(API_URL + 'get/' + uuid, config);
  return response.data;
};

const userService = {
  login,
  register,
  logout,
  createClinic,
  getMe,
  getUsers,
  createUser,
  deleteUser,
  updateClinic,
  getClinic,
  updateUser,
  getUser,
};

export default userService;
