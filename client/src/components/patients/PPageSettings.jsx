import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/Patients.css';
import '../../index.css';
import {
  getPatient,
  createPatientsPage,
  reset,
} from '../../features/patients/patientsSlice';

export default function PPageSettings({ uuid }) {
  const dispatch = useDispatch();
  const patientUuid = uuid;
  const { patient, isError, message } = useSelector((state) => state.patients);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // check user's role
    // if (user) {
    //   dispatch(getMe());
    //   let role = user.role;
    //   if (!(role === 'doctor' || role === 'main')) {
    //     alert('Доступ заборонено');
    //     // navigate('/');
    //   }
    // }

    if (isError) {
      console.error('Error:', message);
    }

    dispatch(getPatient(patientUuid));

    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, uuid]);

  useEffect(() => {
    if (patient.login && patient.password) {
      setLogin(patient.login);
      setPassword('Пароль приховано');
      const createButton = document.getElementById('create-ppage-button');
      document.querySelectorAll('.ppage-info-item-input').forEach((input) => {
        input.setAttribute('disabled', '');
      });
      createButton.disabled = true;
      createButton.classList.add('disabled-ppage-button');
      createButton.style.cursor = 'not-allowed';
      console.log(createButton);
    }
    // if (patient.login === null && patient.password === null) {
    //   // disableDeleteButton();
    // }
  }, [patient]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const validateForm = async () => {
    if (!login || !password) {
      alert('Заповніть всі поля');
      return false;
    }
    if (login.length < 3 || password.length < 3) {
      alert('Логін та пароль повинні містити не менше 3 символів');
      return false;
    }
    if (login === password) {
      alert('Логін та пароль не можуть бути однаковими');
      return false;
    }
    if (login === '' || password === '') {
      alert('Заповніть всі поля');
      return false;
    }
    return true;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    let isValid = validateForm();
    if (isValid) {
      dispatch(
        createPatientsPage({
          login: login,
          password: password,
          patientUuid: patientUuid,
        })
      );
      alert('Кабінет пацієнта створено');
      dispatch(getPatient(patientUuid));
    } else {
      alert('Помилка при створенні кабінету пацієнта');
    }
  };

  return (
    <>
      <div className="PPageSettings">
        <div className="ppage-header">
          Особистий кабінет пацієнта: {patient.surname} {patient.name}{' '}
          {patient.patronymic}
        </div>
        <div className="custom-hr"></div>
        <div className="ppage-main">
          <form id="ppage-form">
            <div className="ppage-info-item">
              <label htmlFor="login">Логін:</label>
              <input
                name="login"
                type="text"
                className="ppage-info-item-input"
                defaultValue={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className="ppage-info-item">
              <label htmlFor="password">Пароль:</label>
              <input
                name="password"
                type="text"
                className="ppage-info-item-input"
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>

          <div className="ppage-info-text">
            <p>
              <b>Нагадування!</b>
            </p>
            <p>Використовуйте як логін - телефон або пошту.</p>
          </div>
        </div>
        <div className="ppage-footer">
          <button id="create-ppage-button" type="button" onClick={(e) => handleCreate(e)}>
            Створити кабінет
          </button>
        </div>
      </div>
    </>
  );
}
