import React from 'react';
import '../css/Menu.css';
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
import { useNavigate } from 'react-router-dom';
import HeaderMenu from '../components/HeaderMenu';

function Menu() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderMenu />
      <div className="Menu">
        <div className="menu-buttons">
          <div className="menu-group-buttons">
            <button
              className="menu-button"
              id="account-button"
              onClick={() => navigate('/accounts')}
            >
              <FaUser className="menu-icon" />
              <span className="menu-text">Акаунти</span>
            </button>
            <button
              className="menu-button"
              id="patients-db-button"
              onClick={() => navigate('/patients')}
            >
              <FaDatabase className="menu-icon" />
              <span className="menu-text">База пацієнтів</span>
            </button>
          </div>
          <div className="menu-group-buttons">
            <button
              className="menu-button"
              id="appointments-button"
              onClick={() => navigate('/appointments')}
            >
              <FaClipboardList className="menu-icon" />
              <span className="menu-text">Реєстратура</span>
            </button>
            <button
              className="menu-button"
              id="services-button"
              onClick={() => navigate('/services')}
            >
              <FaMoneyBillWave className="menu-icon" />
              <span className="menu-text">Прайс-лист</span>
            </button>
          </div>
          <div className="menu-group-buttons">
            <button
              className="menu-button"
              id="reports-button"
              onClick={() => navigate('/reports')}
            >
              <FaChartLine className="menu-icon" />
              <span className="menu-text">Звіти</span>
            </button>
            <button
              className="menu-button"
              id="mailing-system-button"
              onClick={() => navigate('/mailingsystem')}
            >
              <FaEnvelope className="menu-icon" />
              <span className="menu-text">Система розсилок</span>
            </button>
          </div>
          <div className="menu-group-buttons">
            <button
              className="menu-button"
              id="dispensary-button"
              onClick={() => navigate('/dispensary')}
            >
              <FaStethoscope className="menu-icon" />
              <span className="menu-text">Диспансеризація</span>
            </button>
            <button
              className="menu-button"
              id="notes-button"
              onClick={() => navigate('/notes')}
            >
              <FaStickyNote className="menu-icon" />
              <span className="menu-text">Нотатки</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
