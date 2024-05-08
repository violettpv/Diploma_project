const express = require('express');
const router = express.Router();
const {
  createTreatmentPlan,
  getTreatmentPlan,
  findPlansByDate,
  deleteTreatmentPlan,
  updateTreatmentPlan,
  getAllPlansOfPatient,
} = require('../controllers/treatmentPlanController');
const { protect } = require('../middleware/authHandler');

router.post('/create', protect, createTreatmentPlan);
router.get('/get/:uuid', protect, getTreatmentPlan);
router.get('/find', protect, findPlansByDate);
router.get('/all/:uuid', protect, getAllPlansOfPatient);
router.delete('/delete/:uuid', protect, deleteTreatmentPlan);
router.put('/update/:uuid', protect, updateTreatmentPlan);

module.exports = router;
