import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../features/user/userSlice';
import { patientSlice } from '../features/patientsPage/patientSlice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    patient: patientSlice.reducer,
  },
});
