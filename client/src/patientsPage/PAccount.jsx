import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import NavigatorPatient from '../components/NavigatorPatient';
import '../css/PatientsPage.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt } from 'react-icons/fa';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import {
  logoutPatient,
  updatePatient,
  reset,
} from '../features/patientsPage/patientSlice';

export default function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patient, isError, message } = useSelector((state) => state.patient);

  useEffect(() => {
    if (!patient) {
      navigate('/login');
    }
  }, []);

  const [login, setLogin] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const formRef = useRef(null);
  const buttonsEditRef = useRef(null);
  const buttonsSaveCancelRef = useRef(null);

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

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  if (!patient) {
    <div>Loading...</div>;
  }

  const logOut = async () => {
    await dispatch(logoutPatient());
    dispatch(reset());
    navigate('/loginpatient');
  };

  const enableEditForm = () => {
    formRef.current.querySelectorAll('.form-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });

    buttonsEditRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
  };

  const cancelEditForm = () => {
    formRef.current.querySelectorAll('.form-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonsEditRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
    setLogin(patient.login);
    setOldPassword('');
    setNewPassword('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      await dispatch(
        updatePatient({
          login: login || patient.login,
          oldPassword: oldPassword,
          newPassword: newPassword,
        })
      );
      toast.success('Дані збережено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      cancelEditForm(e);
    } else {
      toast.error('Помилка при оновленні даних. Перевірте правильність введених даних.', {
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

  const validateForm = () => {
    if (oldPassword === '') {
      toast.error('Введіть старий пароль', {
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
    if (newPassword === '') {
      toast.error('Введіть новий пароль', {
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

  return (
    <>
      <div className="Main">
        <NavigatorPatient />
        <div className="main-content">
          <Header />
          <div className="main-body">
            <div className="p-account-main">
              <div className="intro-div">
                <div>
                  <b>
                    Дані особистого кабінету&nbsp;&nbsp;|&nbsp;&nbsp;
                    {patient &&
                      `${patient.surname} ${patient.name} ${patient.patronymic}`}{' '}
                  </b>
                </div>
                <hr className="main-hr" />
                <form name="pa-form" id="pa-form" ref={formRef}>
                  <label>
                    <span>Логін:&nbsp;&nbsp;</span>
                    <input
                      disabled
                      name="login"
                      type="text"
                      className="form-inputs"
                      defaultValue={patient && patient.login}
                      onChange={(e) => setLogin(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Старий пароль:&nbsp;&nbsp;</span>
                    <input
                      disabled
                      name="oldPassword"
                      type="text"
                      className="form-inputs"
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Новий пароль:&nbsp;&nbsp;</span>
                    <input
                      disabled
                      name="newPassword"
                      type="text"
                      className="form-inputs"
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </label>
                </form>
                <hr className="main-hr" />
                <div className="buttons-div">
                  <div className="pa-buttons" ref={buttonsEditRef}>
                    <Button
                      form="patients-info"
                      type="button"
                      onClick={enableEditForm}
                      text="Редагувати"
                      color="var(--piction-blue)"
                    />
                  </div>
                  <div className="pa-buttons-2 disabled" ref={buttonsSaveCancelRef}>
                    <Button
                      form="patients-info"
                      type="button"
                      onClick={(e) => handleSave(e)}
                      text="Зберегти"
                      color="var(--piction-blue)"
                    />
                    <Button
                      form="patients-info"
                      type="button"
                      onClick={cancelEditForm}
                      text="Скасувати"
                      color="gray"
                    />
                  </div>
                </div>
                <div className="logout-div">
                  <button id="logout-button" onClick={logOut}>
                    <FaSignOutAlt />
                  </button>
                  <p>Вийти з особистого кабінету.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
