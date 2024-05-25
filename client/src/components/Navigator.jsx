import React from 'react';
import '../css/Navigator.css';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaDatabase,
  FaClipboardList,
  FaMoneyBillWave,
  FaChartLine,
  FaEnvelope,
  FaStethoscope,
  FaStickyNote,
  FaTooth,
} from 'react-icons/fa';

function Navigator() {
  const navigate = useNavigate();
  return (
    <div className="Navigator">
      <div className="nav-button" onClick={() => navigate('/')}>
        <FaTooth className="nav-icon" />
      </div>
      <div className="nav-button" onClick={() => navigate('/accounts')}>
        <FaUser className="nav-icon" />
      </div>
      <div className="nav-button">
        <FaDatabase className="nav-icon" onClick={() => navigate('/patients')} />
      </div>
      <div className="nav-button">
        <FaClipboardList className="nav-icon" onClick={() => navigate('/appointments')} />
      </div>
      <div className="nav-button">
        <FaMoneyBillWave className="nav-icon" onClick={() => navigate('/services')} />
      </div>
      <div className="nav-button">
        <FaChartLine className="nav-icon" onClick={() => navigate('/reports')} />
      </div>
      <div className="nav-button">
        <FaEnvelope className="nav-icon" onClick={() => navigate('/mailingsystem')} />
      </div>
      <div className="nav-button" onClick={() => navigate('/dispensary')}>
        <FaStethoscope className="nav-icon" />
      </div>
      <div className="nav-button" onClick={() => navigate('/notes')}>
        <FaStickyNote className="nav-icon" />
      </div>
    </div>
  );
}

export default Navigator;
