const express = require('express');
const router = express.Router();
const {
  createDDRecord,
  getDDRecord,
  deleteDDRecord,
  updateDDRecord,
  getAllRecordsOfPatient,
} = require('../controllers/doctorsDiaryController');
const { protect } = require('../middleware/authHandler');

router.post('/create', protect, createDDRecord);
router.get('/get/:uuid', protect, getDDRecord);
router.get('/all/:uuid', protect, getAllRecordsOfPatient);
router.delete('/delete/:uuid', protect, deleteDDRecord);
router.put('/update/:uuid', protect, updateDDRecord);

module.exports = router;
