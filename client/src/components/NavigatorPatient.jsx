import React from 'react';
import '../css/Navigator.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaClipboardList, FaStethoscope, FaTooth } from 'react-icons/fa';

function NavigatorMenu() {
  const navigate = useNavigate();
  return (
    <div className="Navigator">
      <div className="nav-button" onClick={() => navigate('/patientspage/')}>
        <FaTooth className="nav-icon" />
      </div>
      <div className="nav-button" onClick={() => navigate('/patientspage/account')}>
        <FaUser className="nav-icon" />
      </div>
      <div className="nav-button" onClick={() => navigate('/patientspage/appointments')}>
        <FaClipboardList className="nav-icon" />
      </div>
      <div
        className="nav-button"
        onClick={() => navigate('/patientspage/treatmentplans')}
      >
        <FaStethoscope className="nav-icon" />
      </div>
    </div>
  );
}

export default NavigatorMenu;
