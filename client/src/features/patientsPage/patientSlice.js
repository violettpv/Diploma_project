import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientService from './patientService';

const patient = JSON.parse(localStorage.getItem('patient'));

const initialState = {
  patient: patient ? patient : null,
  treatmentPlans: [],
  plan: {},
  appointments: [],
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

export const updatePatient = createAsyncThunk(
  'patient/update',
  async (patientData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().patient.patient.token;
      return await patientService.updatePatient(
        {
          login: patientData.login,
          oldPassword: patientData.oldPassword,
          newPassword: patientData.newPassword,
        },
        token
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

export const getAllTreatmentPlans = createAsyncThunk(
  'patient/allTreatmentPlans',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().patient.patient.token;
      return await patientService.getAllTreatmentPlans(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTreatmentPlan = createAsyncThunk(
  'patient/treatmentPlan',
  async (planUuid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().patient.patient.token;
      return await patientService.getTreatmentPlan(token, planUuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAppointments = createAsyncThunk(
  'patient/appointments',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().patient.patient.token;
      return await patientService.getAppointments(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

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
    resetPlans: (state) => {
      state.treatmentPlans = [];
      state.plan = {};
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
      })
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patient = action.payload;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllTreatmentPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTreatmentPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.treatmentPlans = action.payload;
      })
      .addCase(getAllTreatmentPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTreatmentPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTreatmentPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.plan = action.payload;
      })
      .addCase(getTreatmentPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
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
      });
  },
});

export const { reset, resetPlans } = patientSlice.actions;
export default patientSlice.reducer;
