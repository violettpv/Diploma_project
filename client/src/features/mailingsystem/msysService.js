import axios from 'axios';
const API_URL = '/api/mailingsystem/';
const API_URL_TEMPLATES = '/api/msgtemplate/';

// router.post('/create', createTemplate);
// router.get('/get/:uuid', getTemplate);
// router.get('/all', getAllTemplates);
// router.delete('/delete/:uuid', deleteTemplate);
// router.put('/update/:uuid', updateTemplate);

// router.get('/getappointments', getAppointmentsByDate);
// router.post('/sendreminders', sendReminders);
// router.post('/createmsg', createMessage);
// router.post('/sendmsg', sendMessage);
// router.get('/getbirthdays', getBirthdays);

const createTemplate = async (templateData) => {
  const response = await axios.post(API_URL + 'create', templateData);
  return response.data;
};

const getTemplate = async (uuid) => {
  const response = await axios.get(API_URL_TEMPLATES + 'get/' + uuid);
  return response.data;
};

const getAllTemplates = async () => {
  const response = await axios.get(API_URL_TEMPLATES + 'all');
  return response.data;
};

const deleteTemplate = async (uuid) => {
  const response = await axios.delete(API_URL_TEMPLATES + 'delete/' + uuid);
  return response.data;
};

const updateTemplate = async (uuid, templateData) => {
  // check obj
  const response = await axios.put(API_URL_TEMPLATES + 'update/' + uuid, templateData);
  return response.data;
};

const getAppointmentsByDate = async (date, month, year) => {
  const response = await axios.get(
    API_URL + `getappointments?date=${date}&month=${month}&year=${year}`
  );
  return response.data;
};

const sendReminders = async (appointments) => {
  console.log('service:', appointments);
  const response = await axios.post(API_URL + 'sendreminders', appointments);
  return response.data;
};

const createMessage = async (messageData) => {
  const response = await axios.post(API_URL + 'createmsg', messageData);
  return response.data;
};

// using templates
const sendMessage = async (messageData) => {
  const response = await axios.post(API_URL + 'sendmsg', messageData);
  return response.data;
};

const getBirthdays = async () => {
  const response = await axios.get(API_URL + 'getbirthdays');
  return response.data;
};

const msysService = {
  createTemplate,
  getTemplate,
  getAllTemplates,
  deleteTemplate,
  updateTemplate,
  getAppointmentsByDate,
  sendReminders,
  createMessage,
  sendMessage,
  getBirthdays,
};

export default msysService;
