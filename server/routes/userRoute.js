const express = require('express');
const router = express.Router();
const {
  registerUser,
  createUser,
  loginUser,
  getMe,
  deleteUser,
  updateUser,
  getUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authHandler');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/newuser', protect, createUser);
router.get('/getme', protect, getMe);
router.delete('/delete/:uuid', protect, deleteUser);
router.put('/update/:uuid', protect, updateUser);
router.get('/getusers', getUsers);

module.exports = router;
