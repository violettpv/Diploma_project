const express = require('express');
const router = express.Router();
const {
  createClinic,
  getClinic,
  updateClinic,
  deleteClinic,
} = require('../controllers/clinicController');
const { protect } = require('../middleware/authHandler');

router.post('/create', protect, createClinic);
router.get('/get/:uuid', protect, getClinic);
router.delete('/delete/:uuid', protect, deleteClinic);
router.put('/update/:uuid', protect, updateClinic);

module.exports = router;
