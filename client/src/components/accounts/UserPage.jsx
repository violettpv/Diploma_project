import React, { useEffect, useState } from 'react';
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
      console.log('dispatch: ', data);
      dispatch(updateUser(data));
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

  const userForm = document.getElementById('user-page');
  const buttonsEditDelete = document.getElementsByClassName('clinic-buttons');
  const buttonsSaveCancel = document.getElementsByClassName('clinic-buttons-2');

  const enableEditForm = () => {
    if (user.role === 'administrator' || user.role === 'doctor') {
      toast.warn(
        'У вас немає доступу до редагування Ваших даних. Зверніться до головного адміністратора.',
        {
          position: 'top-right',
          autoClose: 1100,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
      return;
    }

    userForm.querySelectorAll('.card-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });

    buttonsEditDelete[0].classList.add('disabled');
    buttonsSaveCancel[0].classList.remove('disabled');
  };

  const cancelEditForm = () => {
    userForm.querySelectorAll('.card-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonsEditDelete[0].classList.remove('disabled');
    buttonsSaveCancel[0].classList.add('disabled');
  };

  const validateForm = async () => {
    let surname = userForm['surname'].value;
    let name = userForm['name'].value;
    let patronymic = userForm['patronymic'].value;
    let password = userForm['password'].value;
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

  // const userForm = document.getElementById('user-page');
  // const buttonsEditDelete = document.getElementsByClassName('clinic-buttons');
  // const buttonsSaveCancel = document.getElementsByClassName('clinic-buttons-2');

  return (
    <>
      <div className="UserPage">
        {user && (
          <form id="user-page" name="user-page">
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
        <div className="clinic-buttons-both">
          <div className="clinic-buttons">
            <Button
              form="user-page"
              type="button"
              onClick={enableEditForm}
              text="Редагувати"
              color="var(--piction-blue)"
            />
          </div>
          <div className="clinic-buttons-2 disabled">
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
      </div>
    </>
  );
}
