import axios from 'axios';
const API_URL = '/api/dispensary/';

const createDispensary = async (dispensaryData) => {
  const response = await axios.post(API_URL + 'create', dispensaryData);
  return response.data;
};

const getDispensary = async (uuid) => {
  const response = await axios.get(API_URL + 'get/' + uuid);
  return response.data;
};

const getAllDispensary = async () => {
  const response = await axios.get(API_URL + 'all');
  return response.data;
};

const findRecordsOfPatient = async (queryData) => {
  const response = await axios.get(API_URL + `findbypatient?query=${queryData}`);
  return response.data;
};

const findRecordsOfDoctor = async (queryData) => {
  const response = await axios.get(API_URL + `findbydoctor?query=${queryData}`);
  return response.data;
};

const findRecordsByDate = async (date, month, year) => {
  const response = await axios.get(
    API_URL + `findbydate?date=${date}&month=${month}&year=${year}`
  );
  return response.data;
};

const deleteDispensary = async (uuid) => {
  const response = await axios.delete(API_URL + 'delete/' + uuid);
  return response.data;
};

const updateDispensary = async (uuid, dispensaryData) => {
  const response = await axios.put(API_URL + 'update/' + uuid, dispensaryData);
  return response.data;
};

const dispensaryService = {
  createDispensary,
  getDispensary,
  deleteDispensary,
  updateDispensary,
  getAllDispensary,
  findRecordsOfPatient,
  findRecordsOfDoctor,
  findRecordsByDate,
};

export default dispensaryService;
