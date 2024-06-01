import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsers, reset, createUser } from '../../features/user/userSlice';
import { toast } from 'react-toastify';
import Button from '../Button';
import '../../css/Accounts.css';
import '../../index.css';
import Navigator from '../../components/Navigator';
import Header from '../../components/Header';

export default function Clinic() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, users, isError, isSuccess, message } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

    if (!user || user.role !== 'main') {
      navigate('/');
      toast.warn('У вас немає доступу до цієї сторінки', {
        position: 'top-right',
        autoClose: 1700,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      dispatch(getUsers(user.token));
    }

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  if (!user || !users) {
    <div>Loading...</div>;
  }

  const validateForm = () => {
    let surname = document.forms['create-user']['surname'].value;
    let name = document.forms['create-user']['name'].value;
    let patronymic = document.forms['create-user']['patronymic'].value;
    let phone = document.forms['create-user']['phone'].value;
    let email = document.forms['create-user']['email'].value;
    let password = document.forms['create-user']['password'].value;
    let role = document.forms['create-user']['role'].value;
    if (surname === '' || name === '' || phone === '') {
      toast.error("Заповніть обов'язкові поля: прізвище, ім'я, телефон, пошта, пароль.", {
        position: 'top-right',
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (!phone.match(/^\+380\d{9}$/)) {
      toast.error('Невірний формат телефону. Введіть у форматі +380123456789', {
        position: 'top-right',
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (!email === '') {
      if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        toast.error('Невірний формат email', {
          position: 'top-right',
          autoClose: 1800,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        return false;
      }
    }
    if (surname.lenght > 80) {
      toast.error('Прізвище занадто довге', {
        position: 'top-right',
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (name.lenght > 80) {
      toast.error("Ім'я занадто довге", {
        position: 'top-right',
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (patronymic.lenght > 80) {
      toast.error('По батькові занадто довге', {
        position: 'top-right',
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (password.lenght < 12) {
      toast.error('Пароль повинен містити не менше 12 символів', {
        position: 'top-right',
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (role === '' || role === null) {
      toast.error('Оберіть роль', {
        position: 'top-right',
        autoClose: 1800,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      await dispatch(
        createUser({
          surname,
          name,
          patronymic,
          phone,
          email,
          password,
          role,
        })
      );
      toast.success('Акаунт працівника успішно створений', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setSurname('');
      setName('');
      setPatronymic('');
      setPhone('');
      setEmail('');
      setPassword('');
      setRole('');
      navigate('/accounts');
    } else {
      toast.error(
        'Помилка при створенні акаунта. Перевірте правильність введених даних.',
        {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
    }
  };

  return (
    <>
      <div className="Accounts">
        <Navigator />
        <div className="accounts-content">
          <Header />
          <div className="accounts-body">
            <div className="create-user-main">
              <div className="create-user-header">
                <p>Створення акаунта працівника</p>
              </div>
              <hr className="custom-hr" />
              <div className="cu-form-main">
                <form name="create-user" id="create-user">
                  <div className="cu-row">
                    <div>
                      <label htmlFor="surname">Прізвище:</label>
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="name">Ім'я:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="patronymic">По батькові:</label>
                      <input
                        type="text"
                        id="patronymic"
                        name="patronymic"
                        value={patronymic}
                        onChange={(e) => setPatronymic(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="cu-row">
                    <div>
                      <label htmlFor="phone">Номер телефону:</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="email">Пошта:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="password">Пароль акаунту:</label>
                      <input
                        type="text"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="role">Роль:</label>
                      <select
                        id="role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Оберіть роль"
                      >
                        <option value="doctor">Лікар</option>
                        <option value="administrator">Адміністратор</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="create-user-footer">
                <Button
                  form="create-user"
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                  text="Створити"
                  color="var(--piction-blue)"
                />
                <Button
                  form="create-user"
                  type="button"
                  onClick={() => navigate('/accounts')}
                  text="Скасувати"
                  color="gray"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
