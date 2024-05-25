import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteService from './noteService';

const initialState = {
  notes: [],
  oneNote: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData, thunkAPI) => {
    try {
      return await noteService.createNote(noteData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getNote = createAsyncThunk('notes/getNote', async (uuid, thunkAPI) => {
  try {
    return await noteService.getNote(uuid);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getAllNotes = createAsyncThunk('notes/getAllNotes', async (_, thunkAPI) => {
  try {
    return await noteService.getAllNotes();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteNote = createAsyncThunk('notes/deleteNote', async (uuid, thunkAPI) => {
  try {
    return await noteService.deleteNote(uuid);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async (noteData, thunkAPI) => {
    try {
      return await noteService.updateNote(noteData.uuid, noteData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // === CREATE NOTE ===
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE NOTE ===
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = state.notes.filter((oneNote) => oneNote.uuid !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL NOTES ===
      .addCase(getAllNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = action.payload;
      })
      .addCase(getAllNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ONE NOTE ===
      .addCase(getNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.oneNote = action.payload;
        // state.notes = state.notes.map((oneNote) =>
        //   oneNote.uuid === action.payload.uuid ? action.payload : oneNote
        // );
      })
      .addCase(getNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE NOTE ===
      .addCase(updateNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.notes = action.payload;
        state.notes = state.notes.map((oneNote) =>
          oneNote.uuid === action.payload.uuid ? action.payload : oneNote
        );
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = noteSlice.actions;
export default noteSlice.reducer;
