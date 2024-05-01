const express = require('express');
const router = express.Router();
const {
  createAnamnesis,
  getAnamnesis,
  deleteAnamnesis,
  updateAnamnesis,
  getAllAnamnesis,
} = require('../controllers/anamnesisController');

router.post('/create', createAnamnesis);
router.get('/get/:uuid', getAnamnesis);
router.get('/all', getAllAnamnesis);
router.delete('/delete/:uuid', deleteAnamnesis);
router.put('/update/:uuid', updateAnamnesis);

module.exports = router;
