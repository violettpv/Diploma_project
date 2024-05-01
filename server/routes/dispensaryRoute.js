const express = require('express');
const router = express.Router();
const {
  createDispensary,
  getDispensary,
  deleteDispensary,
  updateDispensary,
  getAllDispensary,
} = require('../controllers/dispensaryController');

router.post('/create', createDispensary);
router.get('/get/:uuid', getDispensary);
router.get('/all', getAllDispensary);
router.delete('/delete/:uuid', deleteDispensary);
router.put('/update/:uuid', updateDispensary);

module.exports = router;
