import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDate: null,
};

export const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    saveDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    resetDate: (state) => {
      state.selectedDate = null;
    },
  },
});

export const { saveDate, resetDate } = dateSlice.actions;
export default dateSlice.reducer;
