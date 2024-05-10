const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointment,
  getAllAppointmentsDev,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  addReceipt,
  payReceipt,
  getReceipt,
  updateReceipt,
  deleteReceipt,
  getFinishedAppointments,
} = require('../controllers/appointmentController');

router.post('/create', createAppointment);
router.get('/get/:uuid', getAppointment);
router.get('/alldev', getAllAppointmentsDev);
router.get('/all', getAllAppointments);
router.put('/update/:uuid', updateAppointment);
router.delete('/delete/:uuid', deleteAppointment);
router.post('/receipt/create/:uuid', addReceipt);
router.put('/pay/:uuid', payReceipt);
router.get('/receipt/get/:uuid', getReceipt);
router.put('/receipt/update/:uuid', updateReceipt);
router.delete('/receipt/delete/:uuid', deleteReceipt);
router.get('/finished', getFinishedAppointments);

module.exports = router;
