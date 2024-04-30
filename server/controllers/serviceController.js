const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');

// @desc    Create a new service
// @route   POST /api/services/create
// @access  Public
const createService = asyncHandler(async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const service = await Service.create({ name, price });

  res.status(201).json({
    uuid: service.uuid,
    name: service.name,
    price: service.price,
  });
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
  const services = await Service.findAll();
  if (services) {
    res.json(services);
  } else {
    res.status(404);
    throw new Error('Services not found');
  }
});

// @desc    Delete a service
// @route   DELETE /api/services/delete/:uuid
// @access  Public
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ where: { uuid: req.params.uuid } });
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
// @access  Public
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ where: { uuid: req.params.uuid } });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const { name, price } = req.body;
  await service.set({ name, price });
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
