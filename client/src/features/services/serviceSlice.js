import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceService from './serviceService';

const initialState = {
  services: [],
  service: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getServices = createAsyncThunk(
  'services/getServices',
  async (_, thunkAPI) => {
    try {
      return await serviceService.getServices();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getService = createAsyncThunk(
  'services/getService',
  async (uuid, thunkAPI) => {
    try {
      return await serviceService.getService(uuid);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData, thunkAPI) => {
    try {
      return await serviceService.createService(
        serviceData,
        thunkAPI.getState().user.user.token
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

export const updateService = createAsyncThunk(
  'services/updateService',
  async (serviceData, thunkAPI) => {
    try {
      return await serviceService.updateService(
        serviceData.uuid,
        serviceData,
        thunkAPI.getState().user.user.token
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

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (uuid, thunkAPI) => {
    try {
      return await serviceService.deleteService(
        uuid,
        thunkAPI.getState().user.user.token
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

export const searchServices = createAsyncThunk(
  'services/searchServices',
  async (searchData, thunkAPI) => {
    try {
      return await serviceService.searchServices(searchData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // === CREATE SERVICE ===
      .addCase(createService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === DELETE SERVICE ===
      .addCase(deleteService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.services = state.services.filter(
          (service) => service.uuid !== action.payload
        );
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET ALL SERVICES ===
      .addCase(getServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.services = action.payload;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === GET SERVICE ===
      .addCase(getService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.service = action.payload;
      })
      .addCase(getService.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === UPDATE SERVICE ===
      .addCase(updateService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.service = action.payload;
        state.services = state.services.map((service) =>
          service.uuid === action.payload.uuid ? action.payload : service
        );
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // === SEARCH SERVICES ===
      .addCase(searchServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.services = action.payload;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = serviceSlice.actions;
export default serviceSlice.reducer;
