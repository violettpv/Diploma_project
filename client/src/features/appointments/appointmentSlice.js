import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentService from './appointmentService';

const initialState = {
  appointments: [],
  oneAppointment: {},
  receipts: [],
  oneReceipt: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getAppointments = createAsyncThunk(
  'appointments/getAppointments',
  async (queryData, thunkAPI) => {
    try {
      return await appointmentService.getAllAppointments(
        queryData.date,
        queryData.month,
        queryData.year
      );
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAppointment = createAsyncThunk(
  'appointments/getAppointment',
  async (uuid, thunkAPI) => {
    try {
      return await appointmentService.getAppointment(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, thunkAPI) => {
    try {
      return await appointmentService.createAppointment(appointmentData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async (appointmentData, thunkAPI) => {
    try {
      return await appointmentService.updateAppointment(
        appointmentData.uuid,
        appointmentData
      );
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (uuid, thunkAPI) => {
    try {
      return await appointmentService.deleteAppointment(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addReceipt = createAsyncThunk(
  'appointments/addReceipt',
  async (receiptData, thunkAPI) => {
    try {
      return await appointmentService.addReceipt(receiptData.uuid, receiptData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const payReceipt = createAsyncThunk(
  'appointments/payReceipt',
  async (receiptData, thunkAPI) => {
    try {
      return await appointmentService.payReceipt(
        receiptData.uuid,
        receiptData.paymentType
      );
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getReceipt = createAsyncThunk(
  'appointments/getReceipt',
  async (uuid, thunkAPI) => {
    try {
      return await appointmentService.getReceipt(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteReceipt = createAsyncThunk(
  'appointments/deleteReceipt',
  async (uuid, thunkAPI) => {
    try {
      return await appointmentService.deleteReceipt(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFinishedAppointments = createAsyncThunk(
  'appointments/getFinishedAppointments',
  async (queryData, thunkAPI) => {
    try {
      return await appointmentService.getFinishedAppointments(
        queryData.date,
        queryData.month,
        queryData.year
      );
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // === CREATE APPOINTMENT ===
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE APPOINTMENT ===
      .addCase(deleteAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = state.appointments.filter(
          (oneAppointment) => oneAppointment.uuid !== action.payload
        );
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL APPOINTMENTS ===
      .addCase(getAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL FINISHED APPOINTMENTS ===
      .addCase(getFinishedAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFinishedAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = action.payload;
      })
      .addCase(getFinishedAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET APPOINTMENT ===
      .addCase(getAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.oneAppointment = action.payload;
        // state.appointments = state.appointments.map((oneAppointment) =>
        //   oneAppointment.uuid === action.payload.uuid ? action.payload : oneAppointment
        // );
        // state.appointments = action.payload;
      })
      .addCase(getAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE APPOINTMENT ===
      .addCase(updateAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = state.appointments.map((oneAppointment) =>
          oneAppointment.uuid === action.payload.uuid ? action.payload : oneAppointment
        );
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET RECEIPT ===
      .addCase(getReceipt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.oneReceipt = action.payload;
      })
      .addCase(getReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === ADD RECEIPT ===
      .addCase(addReceipt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.receipts.push(action.payload);
      })
      .addCase(addReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === PAY RECEIPT ===
      .addCase(payReceipt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(payReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.service = action.payload;
        state.receipts = state.receipts.map((oneReceipt) =>
          oneReceipt.uuid === action.payload.uuid ? action.payload : oneReceipt
        );
      })
      .addCase(payReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE RECEIPT ===
      .addCase(deleteReceipt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.receipts = state.receipts.filter(
          (oneReceipt) => oneReceipt.uuid !== action.payload
        );
      })
      .addCase(deleteReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = appointmentSlice.actions;
export default appointmentSlice.reducer;
