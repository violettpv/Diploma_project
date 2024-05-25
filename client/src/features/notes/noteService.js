import axios from 'axios';
const API_URL = '/api/notes/';

const createNote = async (noteData) => {
  const response = await axios.post(API_URL + 'create', noteData);
  return response.data;
};

const getNote = async (uuid) => {
  const response = await axios.get(API_URL + 'get/' + uuid);
  return response.data;
};

const getAllNotes = async () => {
  const response = await axios.get(API_URL + 'all');
  return response.data;
};

const deleteNote = async (uuid) => {
  const response = await axios.delete(API_URL + 'delete/' + uuid);
  return response.data;
};

const updateNote = async (uuid, noteData) => {
  const response = await axios.put(API_URL + 'update/' + uuid, noteData);
  return response.data;
};

const noteService = {
  createNote,
  getNote,
  deleteNote,
  updateNote,
  getAllNotes,
};

export default noteService;
