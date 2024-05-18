import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

const user = JSON.parse(localStorage.getItem('user'));
// const clinic = JSON.parse(localStorage.getItem('clinic'));

const initialState = {
  user: user ? user : null,
  // clinic: clinic ? clinic : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const login = createAsyncThunk('user/login', async (user, thunkAPI) => {
  try {
    return await userService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const register = createAsyncThunk('user/register', async (user, thunkAPI) => {
  try {
    return await userService.register(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('user/logout', async () => {
  await userService.logout();
});

export const createClinic = createAsyncThunk(
  'user/createClinic',
  async (clinic, thunkAPI) => {
    try {
      return await userService.createClinic(clinic);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
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
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(createClinic.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createClinic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clinic = action.payload;
      })
      .addCase(createClinic.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.clinic = null;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
