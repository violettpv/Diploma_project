import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import '../../css/Accounts.css';
import '../../index.css';
import { toast } from 'react-toastify';
import Button from '../Button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser, reset } from '../../features/user/userSlice';

export default function UpdateUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { user, oneUser, isError, message } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const userUuid = params.uuid; // delete?
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

    if (!user || user.role !== 'main') {
      navigate('/');
      toast.warn('У вас немає доступу до цієї сторінки', {
        position: 'top-right',
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      dispatch(getUser(params.uuid));
      // console.log('After dispatch: ', oneUser);
    }

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  if (!user || !oneUser) {
    <div>Loading...</div>;
  }

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      const data = {
        uuid: oneUser.uuid,
        surname: surname || oneUser.surname,
        name: name || oneUser.name,
        patronymic: patronymic || oneUser.patronymic,
        password: password || oneUser.password,
      };
      console.log('dispatch: ', data);
      dispatch(updateUser(data));
      toast.success(
        `Дані акаунту ${oneUser.surname} ${oneUser.name} ${oneUser.patronymic} оновлено`,
        {
          position: 'top-right',
          autoClose: 1200,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
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

  const userForm = document.getElementById('update-user');
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
      navigate('/');
    }

    userForm.querySelectorAll('.update-user-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });

    buttonsEditDelete[0].classList.add('disabled');
    buttonsSaveCancel[0].classList.remove('disabled');
  };

  const cancelEditForm = () => {
    userForm.querySelectorAll('.update-user-inputs').forEach((input) => {
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

  return (
    <>
      <div className="Accounts">
        <Navigator />
        <div className="accounts-content">
          <Header />
          <div className="accounts-body">
            <div className="accounts-main">
              <div className="update-user-main">
                <div className="update-user-header">
                  {oneUser && (
                    <p>
                      Оновлення користувача: {oneUser.surname} {oneUser.name}{' '}
                      {oneUser.patronymic} (
                      {oneUser.roles &&
                        oneUser.roles[0].role &&
                        (oneUser.roles[0].role === 'administrator'
                          ? 'Адміністратор'
                          : 'Лікар')}
                      )
                    </p>
                  )}
                  <hr className="custom-hr" />
                </div>
                <form id="update-user" name="update-user">
                  <div className="form-group-row">
                    <label>Прізвище</label>
                    <input
                      name="surname"
                      type="text"
                      disabled
                      className="update-user-inputs"
                      defaultValue={oneUser.surname}
                      onChange={(e) => setSurname(e.target.value)}
                    />
                    <label>Ім'я</label>
                    <input
                      name="name"
                      type="text"
                      disabled
                      className="update-user-inputs"
                      defaultValue={oneUser.name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label>По-батькові</label>
                    <input
                      name="patronymic"
                      type="text"
                      disabled
                      className="update-user-inputs"
                      defaultValue={oneUser.patronymic}
                      onChange={(e) => setPatronymic(e.target.value)}
                    />
                  </div>
                  <div className="form-group-row">
                    <label>Телефон</label>
                    <input
                      name="phone"
                      type="text"
                      readOnly
                      className="update-user-inputs"
                      defaultValue={oneUser.phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <label>Email</label>
                    <input
                      name="email"
                      type="text"
                      readOnly
                      className="update-user-inputs"
                      defaultValue={oneUser.email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Пароль</label>
                    <input
                      name="password"
                      type="text"
                      disabled
                      className="update-user-inputs"
                      placeholder={'Введіть поточний або новий пароль для зміни даних'}
                      // defaultValue={oneUser.password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </form>
                <div className="clinic-buttons-both">
                  <div className="clinic-buttons">
                    <Button
                      form="update-user"
                      type="button"
                      onClick={enableEditForm}
                      text="Редагувати"
                      color="var(--piction-blue)"
                    />
                  </div>
                  <div className="clinic-buttons-2 disabled">
                    <Button
                      form="update-user"
                      type="button"
                      onClick={(e) => onSubmitUpdate(e)}
                      text="Зберегти"
                      color="var(--piction-blue)"
                    />
                    <Button
                      form="update-user"
                      type="button"
                      onClick={cancelEditForm}
                      text="Скасувати"
                      color="gray"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
