const express = require('express');
const router = express.Router();
const {
  getAppointmentsByDate,
  sendReminders,
  // createReminder,
  // getReminder,
  // sendReminder,
} = require('../controllers/mailingSystemController');

// router.get('/get/:uuid', getTemplate);
router.get('/getappointments', getAppointmentsByDate);
router.post('/sendreminders', sendReminders);

module.exports = router;
