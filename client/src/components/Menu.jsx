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

function Menu() {
  return (
    <div className="Menu">
      <div className="menu-buttons">
        <div className="menu-group-buttons">
          <button className="menu-button" id="account-button">
            <FaUser className="menu-icon" />
            <span className="menu-text">Акаунти</span>
          </button>
          <button className="menu-button" id="patients-db-button">
            <FaDatabase className="menu-icon" />
            <span className="menu-text">База пацієнтів</span>
          </button>
        </div>
        <div className="menu-group-buttons">
          <button className="menu-button" id="appointments-button">
            <FaClipboardList className="menu-icon" />
            <span className="menu-text">Реєстратура</span>
          </button>
          <button className="menu-button" id="services-button">
            <FaMoneyBillWave className="menu-icon" />
            <span className="menu-text">Прайс-лист</span>
          </button>
        </div>
        <div className="menu-group-buttons">
          <button className="menu-button" id="reports-button">
            <FaChartLine className="menu-icon" />
            <span className="menu-text">Звіти</span>
          </button>
          <button className="menu-button" id="mailing-system-button">
            <FaEnvelope className="menu-icon" />
            <span className="menu-text">Система розсилок</span>
          </button>
        </div>
        <div className="menu-group-buttons">
          <button className="menu-button" id="dispensary-button">
            <FaStethoscope className="menu-icon" />
            <span className="menu-text">Диспансеризація</span>
          </button>
          <button className="menu-button" id="notes-button">
            <FaStickyNote className="menu-icon" />
            <span className="menu-text">Нотатки</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
