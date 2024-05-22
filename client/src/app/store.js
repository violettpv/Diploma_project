import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../features/user/userSlice';
import { patientSlice } from '../features/patientsPage/patientSlice';
import { patientsSlice } from '../features/patients/patientsSlice';
import { otherSlice } from '../features/other/otherSlice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    patient: patientSlice.reducer,
    patients: patientsSlice.reducer,
    other: otherSlice.reducer,
  },
});
