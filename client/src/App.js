import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Menu from './components/Menu';
import Navigator from './components/Navigator';
import Login from './pages/Login';
import Register from './pages/Register';
import Accounts from './pages/Accounts';
import Appointments from './pages/Appointments';
import Dispensary from './pages/Dispensary';
import Patients from './pages/Patients';
import MailingSystem from './pages/MailingSystem';
import Reports from './pages/Reports';
import Services from './pages/Services';
import Notes from './pages/Notes';
import LoginPatient from './patientsPage/Login';

// const styleApp = {
//   display: 'flex',
//   flexDirection: 'row-reverse',
// };

function App() {
  return (
    <>
      <Router>
        {/* <div className="App" style={styleApp}> */}
        <div className="App">
          {/* <Header style={{ width: '95%' }} /> */}
          <Header />
          <Menu />
          {/* <Navigator /> */}
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Menu />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/services" element={<Services />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/mailingsystem" element={<MailingSystem />} />
          <Route path="/dispensary" element={<Dispensary />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/loginpatient" element={<LoginPatient />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
