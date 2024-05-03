const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');
const User = require('../models/userModel');
const Role = require('../models/roleModel');

// Може створювати та редагувати тільки Main адмін

// @desc    Create a new service
// @route   POST /api/services/create
// @access  Private
const createService = asyncHandler(async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main')) {
    res.status(400);
    throw new Error('User is not a main admin');
  }

  const service = await Service.create({ name, price });

  if (service) {
    res.status(201).json({
      uuid: service.uuid,
      name: service.name,
      price: service.price,
    });
  } else {
    res.status(400);
    throw new Error('Invalid service data');
  }
});

// @desc    Get a service
// @route   Get /api/services/get/:uuid
// @access  Public
const getService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ where: { uuid: req.params.uuid } });
  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});

// @desc    Get all services
// @route   Get /api/services/all
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.findAll({ order: [['name', 'ASC']] });
  if (services) {
    res.json(services);
  } else {
    res.status(404);
    throw new Error('Services not found');
  }
});

// @desc    Delete a service
// @route   DELETE /api/services/delete/:uuid
// @access  Private
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ where: { uuid: req.params.uuid } });

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main')) {
    res.status(400);
    throw new Error('User is not a main admin');
  }

  if (service) {
    await service.destroy();
    res.json({ message: 'Service removed' });
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});

// @desc    Update a service
// @route   PUT /api/services/update/:uuid
// @access  Private
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ where: { uuid: req.params.uuid } });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Check if user's role is 'main' or 'doctor'
  const findUsersRole = await User.findByPk(req.user.uuid, {
    include: { model: Role, through: { attributes: [] } },
  });
  const usersRole = findUsersRole.roles[0].role;
  if (!(usersRole === 'main')) {
    res.status(400);
    throw new Error('User is not a main admin');
  }

  const { name, price } = req.body;
  service.set({ name, price });
  await service.save();

  if (service) {
    res.status(200).json({
      uuid: service.uuid,
      name: service.name,
      price: service.price,
    });
  } else {
    res.status(400);
    throw new Error('Invalid service data');
  }
});

module.exports = {
  createService,
  getService,
  getServices,
  deleteService,
  updateService,
};
