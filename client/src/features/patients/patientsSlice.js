import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientsService from './patientsService';

const initialState = {
  patients: [],
  patient: {},
  anamnesis: {},
  diseases: [],
  form043: {},
  appointments: [],
  treatmentPlans: [],
  tPlan: {},
  docsDiaryRecords: [],
  ddRecord: {},
  dentalFormula: {},
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

export const findPatient = createAsyncThunk(
  'patients/findPatient',
  async (searchData, thunkAPI) => {
    try {
      return await patientsService.findPatient(searchData);
    } catch (error) {
      const message = error.response.data.message;
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
  async (data, thunkAPI) => {
    try {
      return await patientsService.updateAnamnesis(data.uuid, data.diseases);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllDiseases = createAsyncThunk(
  'patients/getAllDiseases',
  async (_, thunkAPI) => {
    try {
      return await patientsService.getAllDiseases();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

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

export const createTreatmentPlan = createAsyncThunk(
  'patients/createTreatmentPlan',
  async (planData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.createTreatmentPlan(planData, token);
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
  'patients/getTreatmentPlan',
  async (uuid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.getTreatmentPlan(uuid, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllPlansOfPatient = createAsyncThunk(
  'patients/getAllPlansOfPatient',
  async (uuid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.getAllPlansOfPatient(uuid, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTreatmentPlan = createAsyncThunk(
  'patients/deleteTreatmentPlan',
  async (uuid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.deleteTreatmentPlan(uuid, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTreatmentPlan = createAsyncThunk(
  'patients/updateTreatmentPlan',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.updateTreatmentPlan(data.uuid, data, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createDocsDiaryRecord = createAsyncThunk(
  'patients/createDocsDiaryRecord',
  async (recordData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.createDocsDiaryRecord(recordData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDocsDiaryRecord = createAsyncThunk(
  'patients/getDocsDiaryRecord',
  async (uuid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.getDocsDiaryRecord(uuid, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllDocsDiaryRecordsOfPatient = createAsyncThunk(
  'patients/getAllDocsDiaryRecordsOfPatient',
  async (uuid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.getAllDocsDiaryRecordsOfPatient(uuid, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteDocsDiaryRecord = createAsyncThunk(
  'patients/deleteDocsDiaryRecord',
  async (uuid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.deleteDocsDiaryRecord(uuid, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateDocsDiaryRecord = createAsyncThunk(
  'patients/updateDocsDiaryRecord',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.updateDocsDiaryRecord(data.uuid, data, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDentalFormula = createAsyncThunk(
  'patients/getDentalFormula',
  async (uuid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.getDentalFormula(uuid, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateDentalFormula = createAsyncThunk(
  'patients/updateDentalFormula',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.updateDentalFormula(data.uuid, data, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createPatientsPage = createAsyncThunk(
  'patients/createPatientsPage',
  async (pageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user.token;
      return await patientsService.createPatientsPage(pageData, token);
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
      // === FIND PATIENT ===
      .addCase(findPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients = action.payload;
      })
      .addCase(findPatient.rejected, (state, action) => {
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
        state.anamnesis = action.payload;
      })
      .addCase(updateAnamnesis.rejected, (state, action) => {
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
      })
      // === CREATE PATIENT'S PAGE ===
      .addCase(createPatientsPage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPatientsPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients = state.patients.map((patient) =>
          patient.uuid === action.payload.uuid ? action.payload : patient
        );
      })
      .addCase(createPatientsPage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === CREATE TREATMENT PLAN ===
      .addCase(createTreatmentPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTreatmentPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.treatmentPlans.push(action.payload);
      })
      .addCase(createTreatmentPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === CREATE DOCS DIARY RECORD ===
      .addCase(createDocsDiaryRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDocsDiaryRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.docsDiaryRecords.push(action.payload);
      })
      .addCase(createDocsDiaryRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE TREATMENT PLAN ===
      .addCase(updateTreatmentPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTreatmentPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.treatmentPlans = state.treatmentPlans.map((tPlan) =>
          tPlan.uuid === action.payload.uuid ? action.payload : tPlan
        );
      })
      .addCase(updateTreatmentPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE DOCS DIARY RECORD ===
      .addCase(updateDocsDiaryRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDocsDiaryRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.docsDiaryRecords = state.docsDiaryRecords.map((ddRecord) =>
          ddRecord.uuid === action.payload.uuid ? action.payload : ddRecord
        );
      })
      .addCase(updateDocsDiaryRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE DENTAL FORMULA ===
      .addCase(updateDentalFormula.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDentalFormula.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dentalFormula = action.payload;
      })
      .addCase(updateDentalFormula.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL TREATMENT PLANS ===
      .addCase(getAllPlansOfPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPlansOfPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.treatmentPlans = action.payload;
      })
      .addCase(getAllPlansOfPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL DOCS DIARY RECORDS ===
      .addCase(getAllDocsDiaryRecordsOfPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDocsDiaryRecordsOfPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.docsDiaryRecords = action.payload;
      })
      .addCase(getAllDocsDiaryRecordsOfPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ONE TREATMENT PLAN ===
      .addCase(getTreatmentPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTreatmentPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tPlan = action.payload;
      })
      .addCase(getTreatmentPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ONE DOCS DIARY RECORD ===
      .addCase(getDocsDiaryRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDocsDiaryRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ddRecord = action.payload;
      })
      .addCase(getDocsDiaryRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET DENTAL FORMULA ===
      .addCase(getDentalFormula.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDentalFormula.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dentalFormula = action.payload;
      })
      .addCase(getDentalFormula.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE TREATMENT PLAN ===
      .addCase(deleteTreatmentPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTreatmentPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.treatmentPlans = state.treatmentPlans.filter(
          (tPlan) => tPlan.uuid !== action.payload
        );
      })
      .addCase(deleteTreatmentPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE DOCS DIARY RECORD ===
      .addCase(deleteDocsDiaryRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDocsDiaryRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.docsDiaryRecords = state.docsDiaryRecords.filter(
          (ddRecord) => ddRecord.uuid !== action.payload
        );
      })
      .addCase(deleteDocsDiaryRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = patientsSlice.actions;
export default patientsSlice.reducer;
