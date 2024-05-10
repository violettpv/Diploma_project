const express = require('express');
const router = express.Router();
const {
  createDentalFormula,
  getDentalFormula,
  deleteDentalFormula,
  updateDentalFormula,
  getAllDentalFormulas, // dev only
} = require('../controllers/dentalFormulaController');
const { protect } = require('../middleware/authHandler');

router.post('/create', protect, createDentalFormula);
router.get('/get/:uuid', protect, getDentalFormula);
router.get('/all', protect, getAllDentalFormulas);
router.delete('/delete/:uuid', protect, deleteDentalFormula);
router.put('/update/:uuid', protect, updateDentalFormula);

module.exports = router;
