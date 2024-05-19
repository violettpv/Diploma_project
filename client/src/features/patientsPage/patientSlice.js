import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientService from './patientService';

const patient = JSON.parse(localStorage.getItem('patient'));

const initialState = {
  patient: patient ? patient : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const loginPatient = createAsyncThunk(
  'patient/login',
  async (patient, thunkAPI) => {
    try {
      return await patientService.loginPatient(patient);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutPatient = createAsyncThunk('patient/logout', async () => {
  await patientService.logoutPatient();
});

export const getMePatient = createAsyncThunk('patient/me', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().patient.patient.token;
    return await patientService.getMePatient(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patient = action.payload;
      })
      .addCase(loginPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.patient = null;
      })
      .addCase(logoutPatient.fulfilled, (state) => {
        state.patient = null;
      })
      .addCase(getMePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patient = action.payload;
      })
      .addCase(getMePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.patient = null;
      });
  },
});

export const { reset } = patientSlice.actions;
export default patientSlice.reducer;
