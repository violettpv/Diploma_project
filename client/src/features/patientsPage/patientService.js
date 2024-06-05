import axios from 'axios';
const API_URL = '/api/patientspage/';

const loginPatient = async (patientData) => {
  const response = await axios.post(API_URL + 'login', patientData);
  if (response.data) {
    localStorage.setItem('patient', JSON.stringify(response.data));
  }
  return response.data;
};

const logoutPatient = () => {
  localStorage.removeItem('patient');
};

const getMePatient = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'me', config);
  return response.data;
};

const getAllTreatmentPlans = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'all/tplans', config);
  return response.data;
};

const updatePatient = async (patientData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + 'update', patientData, config);
  if (response.data) {
    localStorage.setItem('patient', JSON.stringify(response.data));
  }
  return response.data;
};

const getAppointments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'appointments', config);
  return response.data;
};

const patientService = {
  loginPatient,
  logoutPatient,
  getMePatient,
  updatePatient,
  getAllTreatmentPlans,
  getAppointments,
};

export default patientService;
