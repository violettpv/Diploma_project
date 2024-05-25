import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../features/user/userSlice';
import { patientSlice } from '../features/patientsPage/patientSlice';
import { patientsSlice } from '../features/patients/patientsSlice';
import { otherSlice } from '../features/other/otherSlice';
import { serviceSlice } from '../features/services/serviceSlice';
import { appointmentSlice } from '../features/appointments/appointmentSlice';
import { dispensarySlice } from '../features/dispensary/dispensarySlice';
import { noteSlice } from '../features/notes/noteSlice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    patient: patientSlice.reducer,
    patients: patientsSlice.reducer,
    other: otherSlice.reducer,
    services: serviceSlice.reducer,
    appointments: appointmentSlice.reducer,
    dispensary: dispensarySlice.reducer,
    notes: noteSlice.reducer,
    // mailing system
  },
});
