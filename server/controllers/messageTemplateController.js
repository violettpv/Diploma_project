const asyncHandler = require('express-async-handler');
const MessageTemplate = require('../models/messageTemplateModel');

// @desc    Create a new message template
// @route   POST /api/msgtemplate/create
// @access  Public
const createTemplate = asyncHandler(async (req, res) => {
  // можливо зробити що body це json, який буде формувати повідомлення
  // наприклад { "body": { "date": "2024-03-02", "time": "10:00"", "address": "адреса" } }
  // на фронті зробити поля, які можна додавати в шаблон
  const { name, body } = req.body;
  if (!name || !body) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }
  const template = await MessageTemplate.create({ name, body });
  if (template) {
    res.status(201).json({
      uuid: template.uuid,
      name: template.name,
      body: template.body,
    });
  } else {
    res.status(400);
    throw new Error('Invalid template data');
  }
});

// @desc    Get a message template
// @route   Get /api/msgtemplate/get/:uuid
// @access  Public
const getTemplate = asyncHandler(async (req, res) => {
  const template = await MessageTemplate.findByPk(req.params.uuid);
  if (template) {
    res.json(template);
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Get all message templates
// @route   Get /api/msgtemplate/all
// @access  Public
const getAllTemplates = asyncHandler(async (req, res) => {
  const templates = await MessageTemplate.findAll({ order: [['uuid', 'DESC']] });
  if (templates) {
    res.json(templates);
  } else {
    res.status(404);
    throw new Error('Templates not found');
  }
});

// @desc    Delete a message template
// @route   DELETE /api/msgtemplate/delete/:uuid
// @access  Public
const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await MessageTemplate.findByPk(req.params.uuid);
  if (template.uuid === '6d5c51a9-49c6-4510-8de3-afa55dc8ee8f') {
    res.status(400);
    throw new Error('Cannot delete default template');
  }
  if (template) {
    await template.destroy();
    res.json({ message: 'Template removed' });
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Update a message template
// @route   PUT /api/msgtemplate/update/:uuid
// @access  Public
const updateTemplate = asyncHandler(async (req, res) => {
  const template = await MessageTemplate.findByPk(req.params.uuid);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  const { name, body } = req.body;
  template.set({ name, body });
  await template.save();

  if (template) {
    res.json({
      uuid: template.uuid,
      name: template.name,
      body: template.body,
    });
  } else {
    res.status(404);
    throw new Error('Invalid template data');
  }
});

module.exports = {
  createTemplate,
  getTemplate,
  getAllTemplates,
  deleteTemplate,
  updateTemplate,
};
