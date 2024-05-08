const express = require('express');
const router = express.Router();
const {
  createService,
  getService,
  deleteService,
  updateService,
  getServices,
  searchServices,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authHandler');

router.post('/create', protect, createService);
router.get('/get/:uuid', getService);
router.get('/all', getServices);
router.delete('/delete/:uuid', protect, deleteService);
router.put('/update/:uuid', protect, updateService);
router.get('/find', searchServices);

module.exports = router;
