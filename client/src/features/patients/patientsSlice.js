import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientsService from './patientsService';

// const patients = JSON.parse(localStorage.getItem('patients'));
// const anamnesis = JSON.parse(localStorage.getItem('anamnesis'));
// const diseases = JSON.parse(localStorage.getItem('diseases'));

const initialState = {
  patients: [],
  patient: {},
  anamnesis: [],
  diseases: [],
  form043: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getPatients = createAsyncThunk(
  'patients/getPatients',
  async (_, thunkAPI) => {
    try {
      return await patientsService.getPatients();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPatient = createAsyncThunk(
  'patients/getPatient',
  async (uuid, thunkAPI) => {
    try {
      return await patientsService.getPatient(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData, thunkAPI) => {
    try {
      console.log('slice:', patientData);
      return await patientsService.createPatient(patientData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async (data, thunkAPI) => {
    try {
      return await patientsService.updatePatient(data.uuid, data);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (uuid, thunkAPI) => {
    try {
      return await patientsService.deletePatient(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllPatientsAppointments = createAsyncThunk(
  'patients/getAllPatientsAppointments',
  async (uuid, thunkAPI) => {
    try {
      return await patientsService.getAllPatientsAppointments(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createAnamnesis = createAsyncThunk(
  'patients/createAnamnesis',
  async (anamnesisData, thunkAPI) => {
    try {
      return await patientsService.createAnamnesis(anamnesisData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAnamnesis = createAsyncThunk(
  'patients/getAnamnesis',
  async (uuid, thunkAPI) => {
    try {
      return await patientsService.getAnamnesis(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateAnamnesis = createAsyncThunk(
  'patients/updateAnamnesis',
  async (uuid, anamnesisData) => {
    return await patientsService.updateAnamnesis(uuid, anamnesisData);
  }
);

// If delete patient = delete all anamnesis
export const deleteAnamnesis = createAsyncThunk(
  'patients/deleteAnamnesis',
  async (uuid) => {
    return await patientsService.deleteAnamnesis(uuid);
  }
);

export const getAllDiseases = createAsyncThunk('patients/getAllDiseases', async () => {
  return await patientsService.getAllDiseases();
});

export const getForm043 = createAsyncThunk(
  'patients/getForm043',
  async (uuid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.getForm043(uuid, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateForm043 = createAsyncThunk(
  'patients/createForm043',
  async (form043Data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.updateForm043(form043Data.uuid, form043Data, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    // reset: (state) => {
    //   state.isLoading = false;
    //   state.isSuccess = false;
    //   state.isError = false;
    //   state.message = '';
    // },
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // === GET ALL PATIENTS ===
      .addCase(getPatients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients = action.payload;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET PATIENT ===
      .addCase(getPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patient = action.payload;
      })
      .addCase(getPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === CREATE PATIENT ===
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients.push(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE PATIENT ===
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients = state.patients.map((patient) =>
          patient.uuid === action.payload.uuid ? action.payload : patient
        );
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE PATIENT ===
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients = state.patients.filter(
          (patient) => patient.uuid !== action.payload
        );
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL PATIENTS APPOINTMENTS ===
      .addCase(getAllPatientsAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPatientsAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = action.payload;
      })
      .addCase(getAllPatientsAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === CREATE ANAMNESIS ===
      .addCase(createAnamnesis.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAnamnesis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.anamnesis.push(action.payload);
      })
      .addCase(createAnamnesis.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ANAMNESIS ===
      .addCase(getAnamnesis.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAnamnesis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.anamnesis = action.payload;
      })
      .addCase(getAnamnesis.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE ANAMNESIS ===
      .addCase(updateAnamnesis.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAnamnesis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.anamnesis = state.anamnesis.map((anamnesis) =>
          anamnesis.uuid === action.payload.uuid ? action.payload : anamnesis
        );
      })
      .addCase(updateAnamnesis.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE ANAMNESIS ===
      .addCase(deleteAnamnesis.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAnamnesis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.anamnesis = state.anamnesis.filter(
          (anamnesis) => anamnesis.uuid !== action.payload
        );
      })
      .addCase(deleteAnamnesis.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL DISEASES ===
      .addCase(getAllDiseases.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDiseases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.diseases = action.payload;
      })
      .addCase(getAllDiseases.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET FORM043 ===
      .addCase(getForm043.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getForm043.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.form043 = action.payload;
      })
      .addCase(getForm043.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE FORM043 ===
      .addCase(updateForm043.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateForm043.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.form043 = action.payload;
      })
      .addCase(updateForm043.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = patientsSlice.actions;
export default patientsSlice.reducer;
