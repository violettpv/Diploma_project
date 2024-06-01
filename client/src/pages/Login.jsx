import React, { useState, useEffect } from 'react';
import '../css/Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/user/userSlice';
import HeaderMenu from '../components/HeaderMenu';
import { toast } from 'react-toastify';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isSuccess, message } = useSelector((state) => state.user);

  useEffect(() => {
    if (isError) {
      // console.log(message);
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
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
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
              <p>Увійти в акаунт</p>
            </div>
            <div className="login-inputs">
              <label>
                Ел. пошта: &nbsp;
                <input
                  className="form-inputs"
                  name="email"
                  type="email"
                  value={email}
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
              Немає аккаунту?&nbsp;
              <Link to="/register" style={{ color: '#009be5', cursor: 'pointer' }}>
                Зареєструватись.
              </Link>
            </div>
            <div className="register-link">
              Увійти в&nbsp;
              <Link to="/loginpatient" style={{ color: '#009be5', cursor: 'pointer' }}>
                особистий кабінет пацієнта.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
