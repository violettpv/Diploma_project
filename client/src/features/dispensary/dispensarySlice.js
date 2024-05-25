import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dispensaryService from './dispensaryService';

const initialState = {
  dispensary: [],
  oneDispensary: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createDispensary = createAsyncThunk(
  'dispensary/createDispensary',
  async (dispensaryData, thunkAPI) => {
    try {
      return await dispensaryService.createDispensary(dispensaryData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDispensary = createAsyncThunk(
  'dispensary/getDispensary',
  async (uuid, thunkAPI) => {
    try {
      return await dispensaryService.getDispensary(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllDispensary = createAsyncThunk(
  'dispensary/getAllDispensary',
  async (_, thunkAPI) => {
    try {
      return await dispensaryService.getAllDispensary();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const findRecordsOfPatient = createAsyncThunk(
  'dispensary/findRecordsOfPatient',
  async (patient, thunkAPI) => {
    try {
      return await dispensaryService.findRecordsOfPatient(patient);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const findRecordsOfDoctor = createAsyncThunk(
  'dispensary/findRecordsOfDoctor',
  async (doctor, thunkAPI) => {
    try {
      return await dispensaryService.findRecordsOfDoctor(doctor);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const findRecordsByDate = createAsyncThunk(
  'dispensary/findRecordsByDate',
  async (queryData, thunkAPI) => {
    try {
      return await dispensaryService.findRecordsByDate(
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

export const deleteDispensary = createAsyncThunk(
  'dispensary/deleteDispensary',
  async (uuid, thunkAPI) => {
    try {
      return await dispensaryService.deleteDispensary(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateDispensary = createAsyncThunk(
  'dispensary/updateDispensary',
  async (dispensaryData, thunkAPI) => {
    try {
      return await dispensaryService.updateDispensary(
        dispensaryData.uuid,
        dispensaryData
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

export const dispensarySlice = createSlice({
  name: 'dispensary',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // === CREATE DISPENSARY ===
      .addCase(createDispensary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDispensary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.dispensary.push(action.payload);
      })
      .addCase(createDispensary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE DISPENSARY ===
      .addCase(deleteDispensary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDispensary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dispensary = state.dispensary.filter(
          (oneDispensary) => oneDispensary.uuid !== action.payload
        );
      })
      .addCase(deleteDispensary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL DISPENSARY ===
      .addCase(getAllDispensary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDispensary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dispensary = action.payload;
      })
      .addCase(getAllDispensary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ONE DISPENSARY ===
      .addCase(getDispensary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDispensary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.oneDispensary = action.payload;
        // state.appointments = state.appointments.map((oneAppointment) =>
        //   oneAppointment.uuid === action.payload.uuid ? action.payload : oneAppointment
        // );
        // state.appointments = action.payload;
      })
      .addCase(getDispensary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE APPOINTMENT ===
      .addCase(updateDispensary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDispensary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.dispensary = action.payload;
        state.dispensary = state.dispensary.map((oneDispensary) =>
          oneDispensary.uuid === action.payload.uuid ? action.payload : oneDispensary
        );
      })
      .addCase(updateDispensary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === FIND BY PATIENT ===
      .addCase(findRecordsOfPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findRecordsOfPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dispensary = action.payload;
      })
      .addCase(findRecordsOfPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === FIND BY DOCTOR ===
      .addCase(findRecordsOfDoctor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findRecordsOfDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dispensary = action.payload;
      })
      .addCase(findRecordsOfDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === FIND BY DATE ===
      .addCase(findRecordsByDate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findRecordsByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dispensary = action.payload;
      })
      .addCase(findRecordsByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = dispensarySlice.actions;
export default dispensarySlice.reducer;
