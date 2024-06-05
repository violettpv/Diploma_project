import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import msysService from './msysService';

const initialState = {
  reminders: [],
  birthdays: [],
  templates: [],
  oneTemplate: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createTemplate = createAsyncThunk(
  'msystem/createTemplate',
  async (templateData, thunkAPI) => {
    try {
      return await msysService.createTemplate(templateData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTemplate = createAsyncThunk(
  'msystem/getTemplate',
  async (uuid, thunkAPI) => {
    try {
      return await msysService.getTemplate(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllTemplates = createAsyncThunk(
  'msystem/getAllTemplates',
  async (_, thunkAPI) => {
    try {
      return await msysService.getAllTemplates();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'msystem/deleteTemplate',
  async (uuid, thunkAPI) => {
    try {
      return await msysService.deleteTemplate(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'msystem/updateTemplate',
  async (templateData, thunkAPI) => {
    try {
      return await msysService.updateTemplate(templateData.uuid, templateData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAppointmentsByDate = createAsyncThunk(
  'msystem/getAppointmentsByDate',
  async (data, thunkAPI) => {
    try {
      return await msysService.getAppointmentsByDate(data.date, data.month, data.year);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendReminders = createAsyncThunk(
  'msystem/sendReminders',
  async (appointments, thunkAPI) => {
    try {
      return await msysService.sendReminders(appointments);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createMessage = createAsyncThunk(
  'msystem/createMessage',
  async (messageData, thunkAPI) => {
    try {
      return await msysService.createMessage(messageData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'msystem/sendMessage',
  async (messageData, thunkAPI) => {
    try {
      return await msysService.sendMessage(messageData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getBirthdays = createAsyncThunk(
  'msystem/getBirthdays',
  async (_, thunkAPI) => {
    try {
      return await msysService.getBirthdays();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const msysSlice = createSlice({
  name: 'msystem',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // === CREATE TEMPLATE ===
      .addCase(createTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.templates.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET TEMPLATE ===
      .addCase(getTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.oneTemplate = action.payload;
      })
      .addCase(getTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL TEMPLATES ===
      .addCase(getAllTemplates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates = action.payload;
      })
      .addCase(getAllTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE TEMPLATE ===
      .addCase(deleteTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates = state.templates.filter(
          (oneTemplate) => oneTemplate.uuid !== action.payload
        );
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE TEMPLATE ===
      .addCase(updateTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates = state.templates.map((oneTemplate) =>
          oneTemplate.uuid === action.payload.uuid ? action.payload : oneTemplate
        );
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET APPOINTMENTS BY DATE  ===
      .addCase(getAppointmentsByDate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppointmentsByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reminders = action.payload;
      })
      .addCase(getAppointmentsByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === SEND REMINDERS ===
      .addCase(sendReminders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendReminders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendReminders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === CREATE MESSAGE ===
      .addCase(createMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.appointments.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === SEND MESSAGE ===
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET BIRTHDAYS ===
      .addCase(getBirthdays.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBirthdays.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.birthdays = action.payload;
      })
      .addCase(getBirthdays.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = msysSlice.actions;
export default msysSlice.reducer;
