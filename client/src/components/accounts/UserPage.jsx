import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../Button';
import '../../css/Accounts.css';
import '../../index.css';
import { reset, updateUser } from '../../features/user/userSlice';

export default function UserPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, message } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userFormRef = useRef(null);
  const buttonsEditDeleteRef = useRef(null);
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

  if (!user) {
    <div>Loading...</div>;
  }

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      const data = {
        uuid: user.uuid,
        surname: surname || user.surname,
        name: name || user.name,
        patronymic: patronymic || user.patronymic,
        password: password || user.password,
      };
      await dispatch(updateUser(data));
      toast.success('Дані акаунту оновлено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      cancelEditForm();
    } else {
      toast.error('Помилка при оновленні даних. Перевірте правильність введених даних.', {
        position: 'top-right',
        autoClose: 1700,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const enableEditForm = () => {
    userFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });
    buttonsEditDeleteRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
  };

  const cancelEditForm = () => {
    userFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonsEditDeleteRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
  };

  const validateForm = async () => {
    let surname = userFormRef.current['surname'].value;
    let name = userFormRef.current['name'].value;
    let patronymic = userFormRef.current['patronymic'].value;
    let password = userFormRef.current['password'].value;
    if (name === '' || surname === '' || patronymic === '' || password === '') {
      toast.error("Заповніть обов'язкові поля: назва, телефон, адреса, пароль додатку", {
        position: 'top-right',
        autoClose: 1700,
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
      <div className="UserPage">
        {user && (
          <form id="user-page" name="user-page" ref={userFormRef}>
            <div className="user-row">
              <label>
                <span>Прізвище:</span>
                <input
                  name="surname"
                  type="text"
                  disabled
                  className="card-inputs"
                  defaultValue={user.surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </label>
              <label>
                <span>Ім'я:</span>
                <input
                  name="name"
                  type="text"
                  disabled
                  className="card-inputs"
                  defaultValue={user.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                <span>По батькові:</span>
                <input
                  name="patronymic"
                  type="text"
                  disabled
                  className="card-inputs"
                  defaultValue={user.patronymic}
                  onChange={(e) => setPatronymic(e.target.value)}
                />
              </label>
            </div>
            <div className="user-row">
              <label>
                <span>Телефон:</span>
                <input
                  name="phone"
                  type="text"
                  readOnly
                  className="card-inputs"
                  defaultValue={user.phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label>
                <span>Email:</span>
                <input
                  name="email"
                  type="text"
                  readOnly
                  className="card-inputs"
                  defaultValue={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <span>Пароль:</span>
                <input
                  name="password"
                  type="text"
                  disabled
                  className="card-inputs"
                  placeholder="Введіть поточний або новий пароль для зміни даних"
                  defaultValue={user.password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
          </form>
        )}
        {user && user.role && user.role === 'main' && (
          <div className="clinic-buttons-both">
            <div className="clinic-buttons" ref={buttonsEditDeleteRef}>
              <Button
                form="user-page"
                type="button"
                onClick={enableEditForm}
                text="Редагувати"
                color="var(--piction-blue)"
              />
            </div>
            <div className="clinic-buttons-2 disabled" ref={buttonsSaveCancelRef}>
              <Button
                form="user-page"
                type="button"
                onClick={(e) => onSubmitUpdate(e)}
                text="Зберегти"
                color="var(--piction-blue)"
              />
              <Button
                form="user-page"
                type="button"
                onClick={cancelEditForm}
                text="Скасувати"
                color="gray"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
