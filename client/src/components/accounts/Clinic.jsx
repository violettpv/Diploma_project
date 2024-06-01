import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../Button';
import '../../css/Accounts.css';
import '../../index.css';
import { getClinic, updateClinic, reset } from '../../features/user/userSlice';

export default function Clinic() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, clinic, isError, message } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [address, setAddress] = useState('');

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

    dispatch(getClinic());

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  if (!user || !clinic) {
    <div>Loading...</div>;
  }

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      const data = {
        uuid: clinic.uuid,
        name: name || clinic.name,
        phone: phone || clinic.phone,
        phone2: phone2 || clinic.phone2,
        email: email || clinic.email,
        website: website || clinic.website,
        appPassword: appPassword || clinic.appPassword,
        address: address || clinic.address,
      };
      dispatch(updateClinic(data, user.token));
      toast.success('Дані клініки оновлено', {
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
      dispatch(getClinic(user.token));
    } else {
      toast.error(
        'Помилка при оновленні даних клініки. Перевірте правильність введених даних.',
        {
          position: 'top-right',
          autoClose: 1700,
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

  const clinicForm = document.getElementById('clinic');
  const buttonsEditDelete = document.getElementsByClassName('clinic-buttons');
  const buttonsSaveCancel = document.getElementsByClassName('clinic-buttons-2');

  const enableEditForm = () => {
    if (user.role === 'administrator' || user.role === 'doctor') {
      toast.warn('У вас немає доступу до редагування', {
        position: 'top-right',
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    clinicForm.querySelectorAll('.card-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });

    buttonsEditDelete[0].classList.add('disabled');
    buttonsSaveCancel[0].classList.remove('disabled');
  };

  const cancelEditForm = () => {
    clinicForm.querySelectorAll('.card-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonsEditDelete[0].classList.remove('disabled');
    buttonsSaveCancel[0].classList.add('disabled');
  };

  const validateForm = async () => {
    let name = clinicForm['name'].value;
    let phone = clinicForm['phone'].value;
    let phone2 = clinicForm['phone2'].value;
    let email = clinicForm['email'].value;
    let address = clinicForm['address'].value;
    let appPassword = clinicForm['appPassword'].value;
    if (!email === '') {
      if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        alert('Невірний формат email');
        return false;
      }
    }
    if (!phone.match(/^\+380\d{9}$/)) {
      toast.error('Невірний формат телефону 2. Введіть у форматі +380123456789', {
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
    if (!phone2.match(/^\+380\d{9}$/)) {
      toast.error('Невірний формат телефону 2. Введіть у форматі +380123456789', {
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
    if (name === '' || phone === '' || address === '' || appPassword === '') {
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
      <div className="Clinic">
        <form id="clinic" name="clinic">
          <div className="clinic-row">
            <label>
              <span>Назва:</span>
              <input
                name="name"
                type="text"
                disabled
                className="card-inputs"
                defaultValue={clinic.name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              <span>Телефон:</span>
              <input
                name="phone"
                type="text"
                disabled
                className="card-inputs"
                defaultValue={clinic.phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label>
              <span>Телефон 2:</span>
              <input
                name="phone"
                type="text"
                disabled
                className="card-inputs"
                defaultValue={clinic.phone2}
                onChange={(e) => setPhone2(e.target.value)}
              />
            </label>
            <label>
              <span>Email:</span>
              <input
                name="email"
                type="text"
                disabled
                className="card-inputs"
                defaultValue={clinic.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <div className="clinic-row">
            <label>
              <span>Вебсайт:</span>
              <input
                name="website"
                type="text"
                disabled
                className="card-inputs"
                defaultValue={clinic.website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
            <label>
              <span>Пароль додатку:</span>
              <input
                name="appPassword"
                type="text"
                disabled
                className="card-inputs"
                defaultValue={clinic.appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
              />
            </label>
            <label>
              <span>Адреса:</span>
              <input
                name="address"
                type="text"
                disabled
                className="card-inputs"
                defaultValue={clinic.address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
          </div>
        </form>
        <div className="clinic-buttons-both">
          <div className="clinic-buttons">
            <Button
              form="clinic"
              type="button"
              onClick={enableEditForm}
              text="Редагувати"
              color="var(--piction-blue)"
            />
          </div>
          <div className="clinic-buttons-2 disabled">
            <Button
              form="clinic"
              type="button"
              onClick={(e) => onSubmitUpdate(e)}
              text="Зберегти"
              color="var(--piction-blue)"
            />
            <Button
              form="clinic"
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
