import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../Button';
import '../../css/Accounts.css';
import '../../css/Auth.css';
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

  const clinicFormRef = useRef(null);
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
      dispatch(updateClinic(data));
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

  const enableEditForm = () => {
    clinicFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });
    buttonsEditDeleteRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
  };

  const cancelEditForm = () => {
    clinicFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonsEditDeleteRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
  };

  const validateForm = () => {
    let name = clinicFormRef.current['name'].value;
    let phone = clinicFormRef.current['phone'].value;
    let phone2 = clinicFormRef.current['phone2'].value;
    let email = clinicFormRef.current['email'].value;
    let address = clinicFormRef.current['address'].value;
    let appPassword = clinicFormRef.current['appPassword'].value;
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
        <form id="clinic" name="clinic" ref={clinicFormRef}>
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
                name="phone2"
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
              <span className="tooltip-app-password">
                Пароль додатку:
                <span className="tooltiptext">
                  Щоб отримати пароль додатку для системи розсилок потрібно перейти за
                  посиланням: https://myaccount.google.com/apppasswords. Вкажіть назву
                  додатку 'nodemailer' та скопіюйте створений пароль у це поле. Пароль має
                  бути у форматі 16 символів.
                </span>
              </span>
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
        {user && user.role && user.role === 'main' && (
          <div className="clinic-buttons-both">
            <div className="clinic-buttons" ref={buttonsEditDeleteRef}>
              <Button
                form="clinic"
                type="button"
                onClick={enableEditForm}
                text="Редагувати"
                color="var(--piction-blue)"
              />
            </div>
            <div className="clinic-buttons-2 disabled" ref={buttonsSaveCancelRef}>
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
        )}
      </div>
    </>
  );
}
