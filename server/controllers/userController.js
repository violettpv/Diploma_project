const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const UsersRole = require('../models/usersRoleModel');

// @desc    Register a new user (main admin) and a new clinic
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, surname, name, patronymic, phone } = req.body;

  if (!email || !password || !surname || !name || !phone) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if main admin already exists
  const findMain = await User.findAll({
    include: {
      model: Role,
      where: {
        role: 'main',
      },
      through: { attributes: [] },
    },
  });
  if (findMain.length > 0) {
    res.status(400);
    throw new Error('Main admin already exists');
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

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    surname,
    name,
    patronymic,
    phone,
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

  // Check if email and password are not null
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  // Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(400);
    throw new Error('Invalid email or password');
  }

  // Get user's role
  // const usersRole = await User.findOne({
  //   where: { uuid: user.uuid },
  //   include: { model: Role, through: { attributes: [] } },
  // });

  // Check if password is correct
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      uuid: user.uuid,
      email: user.email,
      surname: user.surname,
      name: user.name,
      patronymic: user.patronymic,
      phone: user.phone,
      // Check user's role
      // roles: usersRole.roles.map((obj) => obj.role),
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
  if (!(role === 'doctor' || role === 'administrator')) {
    res.status(400);
    throw new Error('Invalid role');
  }

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    surname,
    name,
    patronymic,
    phone,
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

// @desc    Update user (Main admin)
// @route   PUT /api/users/:uuid
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.uuid);
  if (!user) {
    return res.status(400).json('User not found');
  }

  // Get user's role
  // const usersRole = await User.findOne({
  //   where: { uuid: user.uuid },
  //   include: { model: Role, through: { attributes: [] } },
  // });

  // Check if current user's role is 'main'
  if (!req.user.roles.find((role) => role === 'main')) {
    res.status(403);
    throw new Error('Role error. This user has to be main admin');
  }

  const { email, password, surname, name, patronymic, phone } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.set({
    email,
    password: hashedPassword,
    surname,
    name,
    patronymic,
    phone,
  });
  await user.save();

  if (user) {
    res.status(200).json({
      // user data
      uuid: user.uuid,
      email: user.email,
      surname: user.surname,
      name: user.name,
      patronymic: user.patronymic,
      phone: user.phone,
      // roles: req.user.roles, (from authHandler.js)
      // User's role
      // roles: usersRole.roles.map((obj) => obj.role),
      token: generateToken(req.user.uuid),
    });
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
