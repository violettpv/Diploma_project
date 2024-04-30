const express = require('express');
const router = express.Router();
const {
  createService,
  getService,
  deleteService,
  updateService,
  getServices,
} = require('../controllers/serviceController');

router.post('/create', createService);
router.get('/get/:uuid', getService);
router.get('/all', getServices);
router.delete('/delete/:uuid', deleteService);
router.put('/update/:uuid', updateService);

module.exports = router;
