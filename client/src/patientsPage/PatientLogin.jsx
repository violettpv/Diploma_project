import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import '../css/Auth.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginPatient, reset } from '../features/patientsPage/patientSlice';
import { toast } from 'react-toastify';

export default function PatientLogin() {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const { login, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patient, isError, isSuccess, message } = useSelector((state) => state.patient);

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

    if (isSuccess || patient) {
      navigate('/patientspage');
    }

    dispatch(reset());
  }, [patient, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const patientData = {
      login,
      password,
    };

    dispatch(loginPatient(patientData));
  };

  return (
    <>
      <HeaderMenu />
      <div className="Login">
        <div className="login-container">
          <form className="login-form" onSubmit={onSubmit}>
            <div className="login-intro">
              <p>
                <b>BrightDent</b> вітає Вас!
              </p>
              <p>Увійти в особистий кабінет пацієнта</p>
            </div>
            <div className="login-inputs">
              <label>
                Логін: &nbsp;
                <input
                  className="form-inputs"
                  placeholder="Пошта або телефон"
                  name="login"
                  type="text"
                  value={login}
                  onChange={onChange}
                />
              </label>
              <label>
                Пароль: &nbsp;
                <input
                  className="form-inputs"
                  name="password"
                  type="password"
                  value={password}
                  onChange={onChange}
                />
              </label>
              <button type="submit" className="submit-button">
                Увійти
              </button>
            </div>
            <span style={{ marginBottom: '8px', display: 'hidden', color: 'red' }}></span>
            <div className="register-link">
              Увійти в&nbsp;
              <Link to="/login" style={{ color: '#009be5', cursor: 'pointer' }}>
                акаунт клініки.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
