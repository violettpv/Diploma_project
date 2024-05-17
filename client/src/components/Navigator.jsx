import React from 'react';
import '../css/Navigator.css';
import {
  FaUser,
  FaDatabase,
  FaClipboardList,
  FaMoneyBillWave,
  FaChartLine,
  FaEnvelope,
  FaStethoscope,
  FaStickyNote,
} from 'react-icons/fa';

function Navigator() {
  return (
    <div className="Navigator">
      <div className="nav-button">
        <FaUser className="nav-icon" />
      </div>
      <div className="nav-button">
        <FaDatabase className="nav-icon" />
      </div>
      <div className="nav-button">
        <FaClipboardList className="nav-icon" />
      </div>
      <div className="nav-button">
        <FaMoneyBillWave className="nav-icon" />
      </div>
      <div className="nav-button">
        <FaChartLine className="nav-icon" />
      </div>
      <div className="nav-button">
        <FaEnvelope className="nav-icon" />
      </div>
      <div className="nav-button">
        <FaStethoscope className="nav-icon" />
      </div>
      <div className="nav-button">
        <FaStickyNote className="nav-icon" />
      </div>
    </div>
  );
}

export default Navigator;
