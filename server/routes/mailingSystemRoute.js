const express = require('express');
const router = express.Router();
const {
  getAppointmentsByDate,
  sendReminders,
  createMessage,
  sendMessage,
  getBirthdays,
} = require('../controllers/mailingSystemController');

router.get('/getappointments', getAppointmentsByDate);
router.post('/sendreminders', sendReminders);
router.post('/createmsg', createMessage);
router.post('/sendmsg', sendMessage);
router.get('/getbirthdays', getBirthdays);

module.exports = router;
