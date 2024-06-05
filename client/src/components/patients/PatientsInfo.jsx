import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/Patients.css';
import '../../index.css';
import Button from '../Button';
import {
  getPatient,
  deletePatient,
  updatePatient,
  reset,
} from '../../features/patients/patientsSlice';
import { savePage } from '../../features/other/otherSlice';
import { toast } from 'react-toastify';

export default function PatientsInfo({ uuid }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { patients, patient, isError, message } = useSelector((state) => state.patients);
  const { page } = useSelector((state) => state.other);
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const patientsFormRef = useRef(null);
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

    dispatch(getPatient(uuid));
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, uuid]);

  if (!patients) {
    return <div>Loading...</div>;
  }

  const onSubmitDelete = async (e) => {
    e.preventDefault();
    if (window.confirm('Ви впевнені, що хочете видалити цього пацієнта?')) {
      dispatch(deletePatient(uuid));
      toast.success('Пацієнта видалено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      dispatch(savePage(page));
      navigate('/patients');
    }
  };

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      const data = {
        uuid: uuid,
        surname: surname || patient.surname,
        name: name || patient.name,
        patronymic: patronymic || patient.patronymic,
        phone: phone || patient.phone,
        email: email || patient.email,
        birthdate: birthdate || patient.birthdate,
        address: address || patient.address,
        notes: notes || patient.notes,
      };
      dispatch(updatePatient(data));
      toast.success('Дані пацієнта оновлено', {
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
      dispatch(getPatient(uuid));
    } else {
      toast.error(
        'Помилка при оновленні даних пацієнта. Перевірте правильність введених даних.',
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

  const enableEditForm = () => {
    patientsFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });

    buttonsEditDeleteRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
  };

  const cancelEditForm = () => {
    patientsFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonsEditDeleteRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
  };

  const validateForm = () => {
    let surname = patientsFormRef.current['surname'].value;
    let name = patientsFormRef.current['name'].value;
    let patronymic = patientsFormRef.current['patronymic'].value;
    let phone = patientsFormRef.current['phone'].value;
    let email = patientsFormRef.current['email'].value;
    let birthdate = patientsFormRef.current['birthdate'].value;
    let address = patientsFormRef.current['address'].value;

    if (surname === '' || name === '' || phone === '' || birthdate === '') {
      toast.error(
        "Заповніть обов'язкові поля: прізвище, ім'я, телефон, дату народження",
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
      return false;
    }
    if (!phone.match(/^\+380\d{9}$/)) {
      toast.error('Невірний формат телефону. Введіть у форматі +380123456789', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (!birthdate.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
      toast.error('Невірний формат дати народження. Введіть у форматі рррр.мм.дд', {
        position: 'top-right',
        autoClose: 1500,
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
          autoClose: 1500,
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
    if (surname.lenght >= 80) {
      toast.error('Прізвище занадто довге', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (name.lenght >= 80) {
      toast.error("Ім'я занадто довге", {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (patronymic.lenght >= 80) {
      toast.error('По батькові занадто довге', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (address.lenght >= 200) {
      toast.error(
        'Адреса занадто довга. Приклади: "м. Львів, вул. Шевченка, 1", "м. Київ"',
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
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="PatientsInfo">
        <div className="patients-info-main">
          <div className="patients-fullname">
            {patient.surname} {patient.name} {patient.patronymic}
          </div>
          <hr className="custom-hr" />
          <form id="patients-info" className="patients-data" ref={patientsFormRef}>
            <div className="patients-data-row">
              <label>
                <span>Прізвище:</span>
                <input
                  name="surname"
                  type="text"
                  disabled
                  className="card-inputs"
                  defaultValue={patient.surname}
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
                  defaultValue={patient.name}
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
                  defaultValue={patient.patronymic}
                  onChange={(e) => setPatronymic(e.target.value)}
                />
              </label>
              <label>
                <span>Телефон:</span>
                <input
                  name="phone"
                  type="text"
                  disabled
                  className="card-inputs"
                  defaultValue={patient.phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
            </div>
            <div className="patients-data-row">
              <label>
                <span>Email:</span>
                <input
                  name="email"
                  type="text"
                  disabled
                  className="card-inputs"
                  defaultValue={patient.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <span>Дата народження:</span>
                <input
                  name="birthdate"
                  type="text"
                  disabled
                  className="card-inputs"
                  defaultValue={patient.birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </label>
              <label>
                <span>Адреса:</span>
                <input
                  name="address"
                  type="text"
                  disabled
                  className="card-inputs"
                  defaultValue={patient.address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </label>
              <label>
                <span>Примітки:</span>
                <textarea
                  name="notes"
                  disabled
                  className="card-inputs"
                  defaultValue={patient.notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
            </div>
          </form>
          <div className="patients-info-buttons-both">
            <div className="patients-info-buttons" ref={buttonsEditDeleteRef}>
              <Button
                form="patients-info"
                type="button"
                onClick={enableEditForm}
                text="Редагувати"
                color="var(--piction-blue)"
              />
              <Button
                form="patients-info"
                type="button"
                onClick={(e) => onSubmitDelete(e)}
                text="Видалити"
                color="var(--delete-button-color)"
              />
            </div>
            <div className="patients-info-buttons-2 disabled" ref={buttonsSaveCancelRef}>
              <Button
                form="patients-info"
                type="button"
                onClick={(e) => onSubmitUpdate(e)}
                text="Зберегти"
                color="var(--piction-blue)"
              />
              <Button
                form="patients-info"
                type="button"
                onClick={cancelEditForm}
                text="Скасувати"
                color="gray"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
