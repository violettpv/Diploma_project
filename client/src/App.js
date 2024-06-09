import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import TreatmentPlan from './components/patients/TreatmentPlan';
import CreateTreatmentPlan from './components/patients/CreateTreatmentPlan';
import DDRecord from './components/patients/DocsDiary/DDRecord';
import CreateDDRecord from './components/patients/DocsDiary/CreateDDRecord';
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
import PTreatmentPlans from './patientsPage/PTreatmentPlans';
import PPlanCard from './patientsPage/PPlanCard';

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

            {/* <Route path="/accounts" element={<Accounts />} /> */}
            <Route path="/accounts" element={<Navigate to="/accounts/me" />} />
            <Route path="/accounts/:tab?" element={<Accounts />} />

            <Route path="/services" element={<Services />} />
            <Route path="/services/update/:uuid" element={<EditService />} />
            <Route path="/services/create/" element={<AddService />} />

            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/create/" element={<CreatePatient />} />
            {/* <Route path="/patients/get/:uuid" element={<PatientsCard />} /> */}
            {/* <Route path="/patients/get/:uuid/:tab?" element={<PatientsCard />} /> */}
            <Route path="/patients/card/:uuid/:tab?" element={<PatientsCard />} />
            <Route path="/patients/tplan/:uuid" element={<TreatmentPlan />} />
            <Route
              path="/patients/tplan/create/:uuid"
              element={<CreateTreatmentPlan />}
            />
            <Route path="/patients/docsdiary/:uuid" element={<DDRecord />} />
            <Route path="/patients/docsdiary/create/:uuid" element={<CreateDDRecord />} />

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

            {/* <Route path="/mailingsystem" element={<MailingSystem />} /> */}
            <Route
              path="/mailingsystem"
              element={<Navigate to="/mailingsystem/info" />}
            />
            <Route path="/mailingsystem/:tab?" element={<MailingSystem />} />
            <Route path="/mailingsystem/edit/:uuid" element={<EditTemplate />} />
            <Route path="/mailingsystem/createtemplate" element={<CreateTemplate />} />

            <Route path="/patientspage" element={<PatientsPageMain />} />
            <Route path="/patientspage/appointments" element={<PAppointments />} />
            <Route path="/patientspage/account" element={<PAccount />} />
            <Route path="/patientspage/treatmentplans" element={<PTreatmentPlans />} />
            <Route
              path="/patientspage/treatmentplans/get/:uuid"
              element={<PPlanCard />}
            />

            {/* <Route path="*" element={<h1>Not Found</h1>} /> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
