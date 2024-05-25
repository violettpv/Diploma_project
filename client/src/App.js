import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Menu from './pages/Menu';
// Account
import Login from './pages/Login';
import Register from './pages/Register';
import Accounts from './pages/Accounts';
// Appointments
import Appointments from './pages/Appointments';
import CreateAppointment from './components/appointments/CreateAppointment';
import EditAppointment from './components/appointments/EditAppointment';
import AddReceipt from './components/appointments/AddReceipt';
import ReceiptPage from './components/appointments/ReceiptPage';
// Dispensary
import Dispensary from './pages/Dispensary';
import EditDispensaryRecord from './components/dispensary/EditDispensaryRecord';
import CreateDispensaryRecord from './components/dispensary/CreateDispensaryRecord';
// Patients
import Patients from './pages/Patients';
import PatientsCard from './components/patients/PatientsCard';
import CreatePatient from './components/patients/CreatePatient';
// Mailing System
import MailingSystem from './pages/MailingSystem';
// Reports
import Reports from './pages/Reports';
// Services
import Services from './pages/Services';
import EditService from './components/services/EditService';
import AddService from './components/services/AddService';
// Notes
import Notes from './pages/Notes';
import NoteCard from './components/notes/NoteCard';
// Patient's Page
import PatientLogin from './patientsPage/PatientLogin';
import PatientsPageMain from './patientsPage/Main';

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loginpatient" element={<PatientLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/update/:uuid" element={<EditService />} />
            <Route path="/services/create/" element={<AddService />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/get/:uuid" element={<PatientsCard />} />
            <Route path="/patients/create/" element={<CreatePatient />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/create" element={<CreateAppointment />} />
            <Route path="/appointments/update/:uuid" element={<EditAppointment />} />
            <Route path="/appointments/receipt/create/:uuid" element={<AddReceipt />} />
            <Route path="/appointments/receipt/:uuid" element={<ReceiptPage />} />
            <Route path="/dispensary" element={<Dispensary />} />
            <Route path="/dispensary/update/:uuid" element={<EditDispensaryRecord />} />
            <Route path="/dispensary/create" element={<CreateDispensaryRecord />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/get/:uuid" element={<NoteCard />} />
            <Route path="/patientspage" element={<PatientsPageMain />} />
            <Route path="/mailingsystem" element={<MailingSystem />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
