const express = require('express');
const router = express.Router();
const {
  createDispensary,
  getDispensary,
  deleteDispensary,
  updateDispensary,
  getAllDispensary,
  findRecordsOfPatient,
  findRecordsOfDoctor,
  findRecordsByDate,
} = require('../controllers/dispensaryController');

router.post('/create', createDispensary);
router.get('/get/:uuid', getDispensary);
router.get('/all', getAllDispensary);
router.get('/findbypatient', findRecordsOfPatient);
router.get('/findbydoctor', findRecordsOfDoctor);
router.get('/findbydate', findRecordsByDate);
router.delete('/delete/:uuid', deleteDispensary);
router.put('/update/:uuid', updateDispensary);

module.exports = router;
