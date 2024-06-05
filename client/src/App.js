import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from './pages/Menu';
// Account
import Login from './pages/Login';
import Register from './pages/Register';
import Accounts from './pages/Accounts';
import CreateUser from './components/accounts/CreateUser';
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
import CreateTemplate from './components/mailingsystem/CreateTemplate';
import EditTemplate from './components/mailingsystem/EditTemplate';
// Reports
import Reports from './pages/Reports';
// Services
import Services from './pages/Services';
import EditService from './components/services/EditService';
import AddService from './components/services/AddService';
// Notes
import Notes from './pages/Notes';
import NoteCard from './components/notes/NoteCard';
import CreateNote from './components/notes/CreateNote';
// Patient's Page
import PatientLogin from './patientsPage/PatientLogin';
import PatientsPageMain from './patientsPage/Main';
import PAppointments from './patientsPage/PAppointments';
import PAccount from './patientsPage/PAccount';

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            limit={5}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loginpatient" element={<PatientLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/createuser" element={<CreateUser />} />
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
            <Route path="/notes/create" element={<CreateNote />} />
            <Route path="/mailingsystem" element={<MailingSystem />} />
            <Route path="/mailingsystem/edit/:uuid" element={<EditTemplate />} />
            <Route path="/mailingsystem/createtemplate" element={<CreateTemplate />} />
            <Route path="/patientspage" element={<PatientsPageMain />} />
            <Route path="/patientspage/appointments" element={<PAppointments />} />
            <Route path="/patientspage/account" element={<PAccount />} />
            {/* <Route path="*" element={<h1>Not Found</h1>} /> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
