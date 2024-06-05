import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/Patients.css';
import '../../index.css';
import { toast } from 'react-toastify';
import {
  getPatient,
  createPatientsPage,
  reset,
} from '../../features/patients/patientsSlice';

export default function PPageSettings({ uuid }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const patientUuid = uuid;
  const { patient, isError, message } = useSelector((state) => state.patients);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const createButtonRef = useRef(null);
  const inputRefs = useRef({});

  useEffect(() => {
    if (isError) {
      toast.error(message, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
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

      const createButton = createButtonRef.current;
      Object.values(inputRefs.current).forEach((input) => {
        input.setAttribute('disabled', '');
      });

      createButton.disabled = true;
      createButton.classList.add('disabled-ppage-button');
      createButton.style.cursor = 'not-allowed';
    }
  }, [patient]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const validateForm = async () => {
    if (!login || !password) {
      toast.error('Заповніть всі поля', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (login.length < 3 || password.length < 3) {
      toast.error('Логін та пароль повинні містити не менше 3 символів', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (login === password) {
      toast.error('Логін та пароль не можуть бути однаковими', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (login === '' || password === '') {
      toast.error('Заповніть всі поля', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
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
      toast.success('Кабінет пацієнта створено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      dispatch(getPatient(patientUuid));
    } else {
      toast.error('Помилка при створенні кабінету пацієнта', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
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
                ref={(el) => (inputRefs.current.login = el)}
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
                ref={(el) => (inputRefs.current.password = el)}
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
          <button
            id="create-ppage-button"
            type="button"
            ref={createButtonRef}
            onClick={(e) => handleCreate(e)}
          >
            Створити кабінет
          </button>
        </div>
      </div>
    </>
  );
}
