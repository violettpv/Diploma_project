const express = require('express');
const router = express.Router();
const {
  createNote,
  getNote,
  deleteNote,
  updateNote,
  getNotes,
} = require('../controllers/noteController');

router.post('/create', createNote);
router.get('/get/:uuid', getNote);
router.get('/all', getNotes);
router.delete('/delete/:uuid', deleteNote);
router.put('/update/:uuid', updateNote);

module.exports = router;
