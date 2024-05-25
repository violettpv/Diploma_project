const express = require('express');
const router = express.Router();
const {
  getAnamnesis,
  // deleteAnamnesis,
  updateAnamnesis,
  getAllAnamnesis,
  getDiseases,
} = require('../controllers/anamnesisController');

router.get('/get/:uuid', getAnamnesis);
router.get('/all', getAllAnamnesis); // dev
// router.delete('/delete/:uuid', deleteAnamnesis);
router.put('/update/:uuid', updateAnamnesis);
router.get('/diseases', getDiseases);

module.exports = router;
