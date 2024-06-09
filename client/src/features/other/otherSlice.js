import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  page: 0,
};
export const otherSlice = createSlice({
  name: 'other',
  initialState,
  reducers: {
    resetPage: (state) => initialState,
    savePage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { resetPage, savePage } = otherSlice.actions;
export default otherSlice;
