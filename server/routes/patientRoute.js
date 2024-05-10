const express = require('express');
const router = express.Router();
const {
  createPatient,
  getPatient,
  deletePatient,
  updatePatient,
  getPatients,
  findPatientByPhone,
  findPatientByName,
} = require('../controllers/patientController');

router.post('/create', createPatient);
router.get('/get/:uuid', getPatient);
router.get('/findbyname', findPatientByName);
router.get('/findbyphone', findPatientByPhone);
router.get('/all', getPatients);
router.delete('/delete/:uuid', deletePatient);
router.put('/update/:uuid', updatePatient);

module.exports = router;