const express = require('express');
const router = express.Router();
const {
  createForm043,
  getForm043,
  deleteForm043,
  updateForm043,
  getAllForm043s,
} = require('../controllers/form043Controller');
const { protect } = require('../middleware/authHandler');

router.post('/create', protect, createForm043);
router.get('/get/:uuid', protect, getForm043);
router.get('/all', protect, getAllForm043s);
router.delete('/delete/:uuid', protect, deleteForm043);
router.put('/update/:uuid', protect, updateForm043);

module.exports = router;
