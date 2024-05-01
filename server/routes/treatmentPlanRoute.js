const express = require('express');
const router = express.Router();
const {
  createTreatmentPlan,
  getTreatmentPlan,
  deleteTreatmentPlan,
  updateTreatmentPlan,
  getAllTreatmentPlans,
} = require('../controllers/treatmentPlanController');

router.post('/create', createTreatmentPlan);
router.get('/get/:uuid', getTreatmentPlan);
router.get('/all', getAllTreatmentPlans);
router.delete('/delete/:uuid', deleteTreatmentPlan);
router.put('/update/:uuid', updateTreatmentPlan);

module.exports = router;
