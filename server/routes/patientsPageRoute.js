const express = require('express');
const router = express.Router();
const {
  loginPatient,
  getMe,
  createPage, // by admin or main
  getTreatmentPlan,
  getAllPlans,
  // Ще мають бути нагадування [Історія повідомлень]
  // Всі візити [Історія візитів]
  deletePage, // by admin ( or auto delete after deleting Patient)
  updatePageInfo, // by patient (password, login)
} = require('../controllers/patientsPageController');
const { protect } = require('../middleware/authHandler');
const { protectPatient } = require('../middleware/patientAuthHandler');

router.post('/login', loginPatient);
router.post('/create', protect, createPage);
router.get('/me', protectPatient, getMe);
router.get('/tplan/:uuid', protectPatient, getTreatmentPlan);
router.get('/all/tplans', protectPatient, getAllPlans);
router.delete('/delete/:uuid', protect, deletePage);
router.put('/update/:uuid', protectPatient, updatePageInfo);

module.exports = router;
