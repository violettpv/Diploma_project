import React from 'react';
import Header from '../components/Header';
import NavigatorPatient from '../components/NavigatorPatient';
import {
  FaUser,
  FaClipboardList,
  FaStethoscope,
  FaTooth,
  FaSignOutAlt,
} from 'react-icons/fa';
import '../css/PatientsPage.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getMePatient,
  logoutPatient,
  reset,
} from '../features/patientsPage/patientSlice';

export default function Main() {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { patient, isError, message } = useSelector((state) => state.patient);

  // useEffect(() => {
  //   if (isError) {
  //     console.log(message);
  //   }

  //   if (!patient) {
  //     navigate('/loginpatient');
  //   }

  //   dispatch(getMePatient());
  //   // console.log(patient);

  //   return () => {
  //     dispatch(reset());
  //   };
  // }, [patient, navigate, isError, message, dispatch]);

  return (
    <div className="Main">
      <NavigatorPatient />
      <div className="main-content">
        <Header />
        <div className="main-body">
          <div className="main-main">
            <div className="intro-div">
              <div>
                Вітаємо,{' '}
                <span id="fullname" style={{ fontWeight: 'bold' }}>
                  Прізвище Ім'я По батькові
                </span>
                !
              </div>
              <hr className="main-hr" />
              <div>
                <b>Як користуватися особистим кабінетом?</b>
              </div>
              <div>
                <span style={{ fontSize: '22px' }}>&#8678;</span>&nbsp;Зліва знаходиться
                навігаційне меню. Тут Ви можете обрати потрібний розділ.
              </div>
              <div>
                <p>
                  <FaTooth className="icon" />
                  &nbsp;Посилання на головну (поточну) сторінку.
                </p>
                <p>
                  <FaUser className="icon" />
                  &nbsp;Ваші дані акаунту.
                </p>
                <p>
                  <FaClipboardList className="icon" />
                  &nbsp;Ваші візити до клініки.
                </p>
                <p>
                  <FaStethoscope className="icon" />
                  &nbsp;Ваші плани лікування.
                </p>
              </div>
              <hr className="main-hr" />
              <div className="logout-div">
                <button
                  id="logout-button"
                  // </div>onClick={logOut()}
                >
                  <FaSignOutAlt />
                </button>
                <p>Вийти з особистого кабінету.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
