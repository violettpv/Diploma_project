const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const UsersRole = require('../models/usersRoleModel');
const Clinic = require('../models/clinicModel');

// @desc    Register a new user (main admin) and a new clinic
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    surname,
    name,
    patronymic,
    phone,
    clinicName,
    clinicAddress,
    clinicPhone,
    clinicPhone2,
    clinicEmail,
    clinicWebsite,
  } = req.body;

  // чи зробити перевірку тільки на клієнті??
  if (!email || !password || !surname || !name || !phone || !clinicName) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a clinic ('name' is required field)
  const clinic = await Clinic.create({ name: clinicName });

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    surname,
    name,
    patronymic,
    phone,
    clinicUuid: clinic.uuid,
  });

  // Find main admin role
  const mainRole = await Role.findOrCreate({ where: { role: 'main' } });
  if (!mainRole) {
    res.status(400);
    throw new Error('Role not found');
  }

  // Create a record in UserRole table to bind user to role
  const usersRole = await UsersRole.create({
    userUuid: user.uuid,
    roleUuid: mainRole[0].uuid,
  });

  if (user) {
    res.status(201).json({
      // user data
      uuid: user.uuid,
      email: user.email,
      surname: user.surname,
      name: user.name,
      patronymic: user.patronymic,
      phone: user.phone,
      // clinic data
      clinicUuid: clinic.uuid,
      clinicName: clinic.name,
      clinicAddress: clinic.address,
      clinicPhone: clinic.phone,
      clinicPhone2: clinic.phone2,
      clinicEmail: clinic.email,
      clinicWebsite: clinic.website,
      token: generateToken(user.uuid),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(400);
    throw new Error('Invalid email or password');
  }

  const usersRole = await User.findOne({
    where: { uuid: user.uuid },
    include: { model: Role, through: { attributes: [] } },
  });

  // Check if password is correct
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      uuid: user.uuid,
      email: user.email,
      surname: user.surname,
      name: user.name,
      patronymic: user.patronymic,
      phone: user.phone,
      clinicUuid: user.clinicUuid,
      // check user's role
      roles: usersRole.roles.map((obj) => obj.role),
      token: generateToken(user.uuid),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc   Create a user and give him/her a role
// @route  POST /api/users
// @access Private (main's admin)
const createUser = asyncHandler(async (req, res) => {
  const { email, password, surname, name, patronymic, phone, role } = req.body;

  // чи зробити перевірку тільки на клієнті??
  if (!email || !password || !surname || !name || !phone || !role) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if current user's role is 'main'
  if (!req.user.roles.find((role) => role === 'main')) {
    res.status(403);
    throw new Error('You are not allowed to create a new user');
  }

  // Check if user exists
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Check if role is doctor or administrator
  if (role !== 'doctor' && role !== 'administrator') {
    res.status(400);
    throw new Error('Invalid role');
  }

  // Save current clinic_id
  const currentClinicId = req.user.clinicUuid;

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    surname,
    name,
    patronymic,
    phone,
    clinicUuid: currentClinicId,
  });

  const findRole = await Role.findOrCreate({ where: { role: role } });
  if (!findRole) {
    res.status(400);
    throw new Error('Role not found');
  }

  // Add role to user
  const usersRole = await UsersRole.create({
    userUuid: user.uuid,
    roleUuid: findRole[0].uuid,
  });

  if (user) {
    res.status(201).json({
      // user data
      uuid: user.uuid,
      email: user.email,
      surname: user.surname,
      name: user.name,
      patronymic: user.patronymic,
      phone: user.phone,
      // roles: [role],
      token: generateToken(user.uuid),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.uuid);

  if (!user) {
    return res.status(400).json('User not found');
  }

  // Check if current user's role is 'main'
  if (!req.user.roles.find((role) => role === 'main')) {
    res.status(403);
    throw new Error('You are not allowed to delete a user');
  }

  await user.destroy();
  res.status(200).json('User deleted successfully');
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(400).json('User not found');
  }

  const {
    email,
    password,
    surname,
    name,
    patronymic,
    phone,
    clinicName,
    clinicAddress,
    clinicPhone,
    clinicPhone2,
    clinicEmail,
    clinicWebsite,
  } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const updatedUser = await User.findByPk(
    req.params.id,
    {
      email,
      password: hashedPassword,
      surname,
      name,
      patronymic,
      phone,
      clinicName,
      clinicAddress,
      clinicPhone,
      clinicPhone2,
      clinicEmail,
      clinicWebsite,
    },
    {
      new: true,
    }
  );

  if (updatedUser) {
    res.status(200).json({ ...updatedUser._doc, token: generateToken(req.user.uuid) });
  } else {
    res.status(400);
  }
});

// @desc    Get all users
// @route   GET /api/users/getusers
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// @desc    Get user profile
// @route   GET /api/users/getme
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Generate JWT
// @access  Private
const generateToken = (uuid) => {
  return jwt.sign({ uuid }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  createUser,
  getMe,
  getUsers,
  deleteUser,
  updateUser,
};
