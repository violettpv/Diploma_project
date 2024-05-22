import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Accounts from './pages/Accounts';
import Appointments from './pages/Appointments';
import Dispensary from './pages/Dispensary';
import Patients from './pages/Patients';
import PatientsCard from './components/patients/PatientsCard';
import CreatePatient from './components/patients/CreatePatient';
import MailingSystem from './pages/MailingSystem';
import Reports from './pages/Reports';
import Services from './pages/Services';
import EditService from './components/services/EditService';
import AddService from './components/services/AddService';
import Notes from './pages/Notes';
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
            <Route path="/services/update/" element={<EditService />} />
            <Route path="/services/create/" element={<AddService />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/get/:uuid" element={<PatientsCard />} />
            <Route path="/patients/create/" element={<CreatePatient />} />
            {/* <Route path="/appointments" element={<Appointments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/mailingsystem" element={<MailingSystem />} />
            <Route path="/dispensary" element={<Dispensary />} />
            <Route path="/notes" element={<Notes />} /> */}
            <Route path="/patientspage" element={<PatientsPageMain />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
