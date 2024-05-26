const asyncHandler = require('express-async-handler');
const Note = require('../models/noteModel');

// @desc    Create a new note
// @route   POST /api/notes/create
// @access  Public
const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const note = await Note.create({ title, content });

  if (note) {
    res.status(201).json({
      uuid: note.uuid,
      title: note.title,
      content: note.content,
    });
  } else {
    res.status(400);
    throw new Error('Invalid note data');
  }
});

// @desc    Get a note
// @route   Get /api/notes/get/:uuid
// @access  Public
const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ where: { uuid: req.params.uuid } });
  if (note) {
    res.json(note);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Get all notes
// @route   Get /api/notes/all
// @access  Public
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.findAll({ order: [['updatedAt', 'DESC']] });
  if (notes) {
    res.json(notes);
  } else {
    res.status(404);
    throw new Error('Notes not found');
  }
});

// @desc    Delete a note
// @route   DELETE /api/notes/delete/:uuid
// @access  Public
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ where: { uuid: req.params.uuid } });
  if (note) {
    await note.destroy();
    res.json({ message: 'Note removed' });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Update a note
// @route   PUT /api/notes/update/:uuid
// @access  Public
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ where: { uuid: req.params.uuid } });
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  const { title, content } = req.body;
  note.set({ title, content });
  await note.save();

  if (note) {
    res.status(200).json({
      uuid: note.uuid,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
  } else {
    res.status(400);
    throw new Error('Invalid note data');
  }
});

module.exports = {
  createNote,
  getNote,
  deleteNote,
  updateNote,
  getNotes,
};
