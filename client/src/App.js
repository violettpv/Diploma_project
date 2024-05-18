import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Accounts from './pages/accounts/Accounts';
import Account from './pages/accounts/Account';
import Appointments from './pages/Appointments';
import Dispensary from './pages/Dispensary';
import Patients from './pages/Patients';
import MailingSystem from './pages/MailingSystem';
import Reports from './pages/Reports';
import Services from './pages/Services';
import Notes from './pages/Notes';
import LoginPatient from './patientsPage/Login';

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accounts" element={<Accounts />} />
            {/*<Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/services" element={<Services />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/mailingsystem" element={<MailingSystem />} />
            <Route path="/dispensary" element={<Dispensary />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/loginpatient" element={<LoginPatient />} /> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
