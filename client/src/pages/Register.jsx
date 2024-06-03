import React, { useState, useEffect } from 'react';
import '../css/Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, createClinic, reset } from '../features/user/userSlice';
import HeaderMenu from '../components/HeaderMenu';
import { toast } from 'react-toastify';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    surname: '',
    name: '',
    patronymic: '',
    phone: '',
  });
  const [clinicData, setClinicData] = useState({
    name: '',
    address: '',
    phone: '',
    phone2: '',
    email: '',
    appPassword: '',
    website: '',
  });

  const { email, password, password2, surname, name, patronymic, phone } = formData;
  const {
    name: clinicName,
    address: clinicAddress,
    phone: clinicPhone,
    phone2: clinicPhone2,
    email: clinicEmail,
    appPassword,
    website,
  } = clinicData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, clinic, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isError) {
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, clinic, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangeClinic = (e) => {
    setClinicData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      const userData = {
        email,
        password,
        surname,
        name,
        patronymic,
        phone,
      };
      const clinicData = {
        name: clinicName,
        address: clinicAddress,
        phone: clinicPhone,
        phone2: clinicPhone2,
        email: clinicEmail,
        appPassword,
        website,
      };

      dispatch(register(userData));
      dispatch(createClinic(clinicData));
    }
  };

  const validateForm = () => {
    // check email and role main already exists
  };

  return (
    <>
      <HeaderMenu />
      <div className="Register">
        <div className="register-container">
          <div className="register-intro">
            <p>
              <b>BrightDent</b> вітає Вас!
            </p>
            <p>
              <b>Зареєструватись</b>
            </p>
          </div>
          <div className="forms-container">
            <form className="register-page-forms" onSubmit={onSubmit}>
              <div className="forms-row">
                <div className="register-form">
                  <div className="form-info">
                    <b>Ваша інформація</b>
                  </div>
                  <div className="register-inputs">
                    <label>
                      Ел. пошта: &nbsp;
                      <input
                        className="form-inputs"
                        name="email"
                        type="email"
                        onChange={onChange}
                      />
                    </label>
                    <label>
                      Пароль: &nbsp;
                      <input
                        className="form-inputs"
                        name="password"
                        type="password"
                      ></input>
                    </label>
                    <label>
                      Повторіть пароль: &nbsp;
                      <input
                        className="form-inputs"
                        name="password2"
                        type="password"
                      ></input>
                    </label>
                    <label>
                      Прізвище: &nbsp;
                      <input
                        className="form-inputs"
                        name="surname"
                        type="text"
                        onChange={onChange}
                      />
                    </label>
                    <label>
                      Ім'я: &nbsp;
                      <input
                        className="form-inputs"
                        name="name"
                        type="text"
                        onChange={onChange}
                      />
                    </label>
                    <label>
                      По-батькові: &nbsp;
                      <input
                        className="form-inputs"
                        name="patronymic"
                        type="text"
                        onChange={onChange}
                      />
                    </label>
                    <label>
                      Телефон: &nbsp;
                      <input
                        className="form-inputs"
                        name="phone"
                        type="text"
                        onChange={onChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="clinic-form">
                  <div className="form-info">
                    <b>Інформація клініки</b>
                  </div>
                  <div className="clinic-inputs">
                    <label>
                      Ім'я: &nbsp;
                      <input
                        className="form-inputs"
                        name="clinicName"
                        type="text"
                        onChange={onChangeClinic}
                      />
                    </label>
                    <label>
                      Адреса: &nbsp;
                      <input
                        className="form-inputs"
                        name="address"
                        type="text"
                        onChange={onChangeClinic}
                      />
                    </label>
                    <label>
                      Телефон: &nbsp;
                      <input
                        className="form-inputs"
                        name="clinicPhone"
                        type="text"
                        onChange={onChangeClinic}
                      />
                    </label>
                    <label>
                      Телефон №2: &nbsp;
                      <input
                        className="form-inputs"
                        name="clinicPhone2"
                        type="text"
                        onChange={onChangeClinic}
                      />
                    </label>
                    <label>
                      Ел. пошта: &nbsp;
                      <input
                        className="form-inputs"
                        name="clinicEmail"
                        type="email"
                        onChange={onChangeClinic}
                      />
                    </label>
                    <label className="tooltip-app-password">
                      Пароль додатку: &nbsp;
                      <span className="tooltiptext">
                        Щоб отримати пароль додатку для системи розсилок потрібно перейти
                        за посиланням: https://myaccount.google.com/apppasswords. Вкажіть
                        назву додатку 'nodemailer' та скопіюйте створений пароль у це
                        поле. Пароль має бути у форматі 16 символів.
                      </span>
                      <input
                        className="form-inputs"
                        name="appPassword"
                        type="text"
                        placeholder="xxxx wwww yyyy zzzz"
                        onChange={onChangeClinic}
                      />
                    </label>
                    <label>
                      Сайт &nbsp;
                      <input
                        className="form-inputs"
                        name="website"
                        type="text"
                        onChange={onChangeClinic}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="register-bottom-info">
                <button type="submit" className="submit-button-reg">
                  Зареєструватись
                </button>
                <div className="register-link">
                  Є аккаунт?&nbsp;
                  <Link to="/login" style={{ color: '#009be5', cursor: 'pointer' }}>
                    Увійти в акаунт.
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
