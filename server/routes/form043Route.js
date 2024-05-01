const express = require('express');
const router = express.Router();
const {
  createForm043,
  getForm043,
  deleteForm043,
  updateForm043,
  getAllForm043s,
} = require('../controllers/form043Controller');

router.post('/create', createForm043);
router.get('/get/:uuid', getForm043);
router.get('/all', getAllForm043s);
router.delete('/delete/:uuid', deleteForm043);
router.put('/update/:uuid', updateForm043);

module.exports = router;
