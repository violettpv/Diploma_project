import axios from 'axios';
const API_URL = '/api/appointments/';

// router.post('/create', createAppointment);
// router.get('/get/:uuid', getAppointment);
// router.get('/all', getAllAppointments);
// router.put('/update/:uuid', updateAppointment);
// router.delete('/delete/:uuid', deleteAppointment);
// router.post('/receipt/create/:uuid', addReceipt);
// router.put('/pay/:uuid', payReceipt);
// router.get('/receipt/get/:uuid', getReceipt);
// router.put('/receipt/update/:uuid', updateReceipt);
// router.delete('/receipt/delete/:uuid', deleteReceipt);
// router.get('/finished', getFinishedAppointments);

const createAppointment = async (appointmentData) => {
  const response = await axios.post(API_URL + 'create', appointmentData);
  return response.data;
};

const getAppointment = async (uuid) => {
  const response = await axios.get(API_URL + 'get/' + uuid);
  return response.data;
};

const getAllAppointments = async (date, month, year) => {
  const response = await axios.get(
    API_URL + `all?date=${date}&month=${month}&year=${year}`
  );
  return response.data;
};

const updateAppointment = async (uuid, appointmentData) => {
  const response = await axios.put(API_URL + 'update/' + uuid, appointmentData);
  return response.data;
};

const deleteAppointment = async (uuid) => {
  const response = await axios.delete(API_URL + 'delete/' + uuid);
  return response.data;
};

const addReceipt = async (uuid, receiptData) => {
  const response = await axios.post(API_URL + 'receipt/create/' + uuid, receiptData);
  return response.data;
};

const payReceipt = async (uuid, paymentType) => {
  const response = await axios.put(API_URL + 'pay/' + uuid, { paymentType });
  return response.data;
};

const getReceipt = async (uuid) => {
  const response = await axios.get(API_URL + 'receipt/get/' + uuid);
  return response.data;
};

const deleteReceipt = async (uuid) => {
  const response = await axios.delete(API_URL + 'receipt/delete/' + uuid);
  return response.data;
};

// Для звітів [Reports.jsx]
const getFinishedAppointments = async (date, month, year) => {
  const response = await axios.get(
    API_URL + `finished?date=${date}&month=${month}&year=${year}`
  );
  return response.data;
};

const appointmentService = {
  createAppointment,
  getAppointment,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  addReceipt,
  payReceipt,
  getReceipt,
  deleteReceipt,
  getFinishedAppointments,
};

export default appointmentService;
