const express = require('express');
const router = express.Router();
const {
  createTemplate,
  getTemplate,
  getAllTemplates,
  deleteTemplate,
  updateTemplate,
} = require('../controllers/messageTemplateController');

router.post('/create', createTemplate);
router.get('/get/:uuid', getTemplate);
router.get('/all', getAllTemplates);
router.delete('/delete/:uuid', deleteTemplate);
router.put('/update/:uuid', updateTemplate);

module.exports = router;
