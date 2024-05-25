import axios from 'axios';
const API_URL = '/api/services/';

const getServices = async () => {
  const response = await axios.get(API_URL + 'all');
  return response.data;
};

const getService = async (uuid) => {
  const response = await axios.get(API_URL + 'get/' + uuid);
  return response.data;
};

const createService = async (serviceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'create', serviceData, config);
  return response.data;
};

const updateService = async (uuid, serviceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + 'update/' + uuid, serviceData, config);
  return response.data;
};

const deleteService = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + 'delete/' + uuid, config);
  return response.data;
};

const searchServices = async (searchData) => {
  const response = await axios.get(API_URL + `find?query=${searchData}`);
  return response.data;
};

const serviceService = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  searchServices,
};

export default serviceService;
