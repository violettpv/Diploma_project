const express = require('express');
const router = express.Router();
const {
  createPatient,
  getPatient,
  deletePatient,
  updatePatient,
  getPatients,
  // findPatientByPhone,
  // findPatientByName,
  findPatient,
  getAllPatientsAppointments,
} = require('../controllers/patientController');

router.post('/create', createPatient);
router.get('/get/:uuid', getPatient);
// router.get('/findbyname', findPatientByName);
// router.get('/findbyphone', findPatientByPhone);
router.get('/find', findPatient);
router.get('/all', getPatients);
router.delete('/delete/:uuid', deletePatient);
router.put('/update/:uuid', updatePatient);
router.get('/appointments/:uuid', getAllPatientsAppointments);

module.exports = router;
