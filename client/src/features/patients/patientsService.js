import axios from 'axios';
const API_URL_PATIENTS = '/api/patients/';
const API_URL_ANAMNESIS = '/api/anamnesis/';
const API_URL_FORM043 = '/api/form043/';
const API_URL_TPLAN = '/api/tplan/';
const API_URL_DOCSDIARY = '/api/docsdiary/';
const API_URL_DENTALFORMULA = '/api/dentalformula/';
const API_URL_PPAGE = '/api/patientspage/';

const getPatients = async () => {
  const response = await axios.get(API_URL_PATIENTS + 'all');
  return response.data;
};

const getPatient = async (uuid) => {
  const response = await axios.get(API_URL_PATIENTS + 'get/' + uuid);
  return response.data;
};

const findPatient = async (query) => {
  const response = await axios.get(API_URL_PATIENTS + `find?query=${query}`);
  return response.data;
};

const createPatient = async (patientData) => {
  const response = await axios.post(API_URL_PATIENTS + 'create', patientData);
  return response.data;
};

const updatePatient = async (uuid, patientData) => {
  const response = await axios.put(API_URL_PATIENTS + 'update/' + uuid, patientData);
  return response.data;
};

const deletePatient = async (uuid) => {
  const response = await axios.delete(API_URL_PATIENTS + 'delete/' + uuid);
  return response.data;
};

const getAllPatientsAppointments = async (uuid) => {
  const response = await axios.get(API_URL_PATIENTS + 'appointments/' + uuid);
  return response.data;
};

const getAnamnesis = async (uuid) => {
  // uuid of patient
  const response = await axios.get(API_URL_ANAMNESIS + 'get/' + uuid);
  return response.data;
};

const updateAnamnesis = async (uuid, anamnesisData) => {
  // uuid of anamnesis
  const response = await axios.put(API_URL_ANAMNESIS + 'update/' + uuid, {
    jsonAnamnesis: JSON.stringify(anamnesisData),
  });
  return response.data;
};

const getAllDiseases = async () => {
  const response = await axios.get(API_URL_ANAMNESIS + 'diseases');
  return response.data;
};

const getForm043 = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL_FORM043 + 'get/' + uuid, config);
  return response.data;
};

const updateForm043 = async (uuid, formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL_FORM043 + 'update/' + uuid, formData, config);
  return response.data;
};

const createTreatmentPlan = async (planData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL_TPLAN + 'create', planData, config);
  return response.data;
};

const getTreatmentPlan = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL_TPLAN + 'get/' + uuid, config);
  return response.data;
};

const getAllPlansOfPatient = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL_TPLAN + 'all/' + uuid, config);
  return response.data;
};

const deleteTreatmentPlan = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL_TPLAN + 'delete/' + uuid, config);
  return response.data;
};

const updateTreatmentPlan = async (uuid, planData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL_TPLAN + 'update/' + uuid, planData, config);
  return response.data;
};

const createDocsDiaryRecord = async (recordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL_DOCSDIARY + 'create', recordData, config);
  return response.data;
};

const getDocsDiaryRecord = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL_DOCSDIARY + 'get/' + uuid, config);
  return response.data;
};

const getAllDocsDiaryRecordsOfPatient = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL_DOCSDIARY + 'all/' + uuid, config);
  return response.data;
};

const deleteDocsDiaryRecord = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL_DOCSDIARY + 'delete/' + uuid, config);
  return response.data;
};

const updateDocsDiaryRecord = async (uuid, recordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL_DOCSDIARY + 'update/' + uuid,
    recordData,
    config
  );
  return response.data;
};

const getDentalFormula = async (uuid, token) => {
  // uuid of patient
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL_DENTALFORMULA + 'get/' + uuid, config);
  return response.data;
};

const updateDentalFormula = async (uuid, dentalFormulaData, token) => {
  // uuid of dental formula
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL_DENTALFORMULA + 'update/' + uuid,
    dentalFormulaData,
    config
  );
  return response.data;
};

const createPatientsPage = async (pageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL_PPAGE + 'create', pageData, config);
  return response.data;
};

const deletePatientsPage = async (uuid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL_PPAGE + 'delete/' + uuid, config);
  return response.data;
};

const patientsService = {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  findPatient,
  getAllPatientsAppointments,
  getAnamnesis,
  updateAnamnesis,
  getAllDiseases,
  getForm043,
  updateForm043,
  createPatientsPage,
  deletePatientsPage,
  getDentalFormula,
  updateDentalFormula,
  createTreatmentPlan,
  getTreatmentPlan,
  getAllPlansOfPatient,
  deleteTreatmentPlan,
  updateTreatmentPlan,
  createDocsDiaryRecord,
  getDocsDiaryRecord,
  getAllDocsDiaryRecordsOfPatient,
  deleteDocsDiaryRecord,
  updateDocsDiaryRecord,
};

export default patientsService;
