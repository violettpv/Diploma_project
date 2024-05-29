import React from 'react';
import { useState } from 'react';
import Header from '../components/Header';
import NavigatorPatient from '../components/NavigatorPatient';
import '../css/PatientsPage.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt } from 'react-icons/fa';
import {
  getMePatient,
  logoutPatient,
  updatePatient,
  reset,
} from '../features/patientsPage/patientSlice';
import Button from '../components/Button';

export default function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patient, isError, message } = useSelector((state) => state.patient);
  const [login, setLogin] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (patient && patient.token) {
      dispatch(getMePatient());
    } else {
      navigate('/loginpatient');
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

  const form = document.getElementById('pa-form');
  const buttonsEdit = document.getElementsByClassName('pa-buttons');
  const buttonsSaveCancel = document.getElementsByClassName('pa-buttons-2');

  const enableEditForm = () => {
    form.querySelectorAll('.form-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });

    buttonsEdit[0].classList.add('disabled');
    buttonsSaveCancel[0].classList.remove('disabled');
  };

  const cancelEditForm = () => {
    form.querySelectorAll('.form-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonsEdit[0].classList.remove('disabled');
    buttonsSaveCancel[0].classList.add('disabled');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      dispatch(
        updatePatient(
          {
            login: login || patient.login,
            oldPassword: oldPassword,
            newPassword: newPassword,
          },
          patient.token
        )
      );
      // console.log(login, oldPassword, newPassword);
      alert('Дані збережено');
      cancelEditForm(e);
      // dispatch(getMePatient());
    } else {
      alert('Помилка при оновленні даних. Перевірте правильність введених даних.');
    }
  };

  const validateForm = () => {
    // if (login === '') {
    //   alert('Введіть логін');
    //   return false;
    // }
    if (oldPassword === '') {
      alert('Введіть старий пароль');
      return false;
    }
    if (newPassword === '') {
      alert('Введіть новий пароль');
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
                <form name="pa-form" id="pa-form">
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
                  <div className="pa-buttons">
                    <Button
                      form="patients-info"
                      type="button"
                      onClick={enableEditForm}
                      text="Редагувати"
                      color="var(--piction-blue)"
                    />
                  </div>
                  <div className="pa-buttons-2 disabled">
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
