import React from 'react';
import Header from '../components/Header';
import '../css/Login.css';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <>
      <div className="Login">
        <div className="login-container">
          <form className="login-form">
            <div className="introduction">
              <span>
                <b>BrightDent</b> вітає Вас!
              </span>
            </div>
            <p>Увійти в акаунт</p>
            <div className="login-inputs">
              <label>
                Ел. пошта: &nbsp;
                <input className="login-register-input" name="email" type="email"></input>
              </label>
              <label>
                Пароль: &nbsp;
                <input
                  className="login-register-input"
                  name="password"
                  type="password"
                ></input>
              </label>
            </div>
            <span style={{ marginBottom: '8px', display: 'hidden', color: 'red' }}></span>
            <div className="register-link">
              Немає аккаунту?&nbsp;
              <Link to="/register" style={{ color: '#009be5', cursor: 'pointer' }}>
                Зареєструватись.
              </Link>
            </div>
            <button type="submit" className="login-button">
              Увійти
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
