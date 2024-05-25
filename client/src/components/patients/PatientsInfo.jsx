import React, { useEffect, useState } from 'react';
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

export default function PatientsInfo({ uuid }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
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
      alert('Пацієнта видалено');
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
      alert('Дані пацієнта оновлено');
      cancelEditForm();
      dispatch(getPatient(uuid));
    } else {
      alert(
        'Помилка при оновленні даних пацієнта. Перевірте правильність введених даних.'
      );
    }
  };

  const patientsForm = document.getElementById('patients-info');
  const buttonsEditDelete = document.getElementsByClassName('patients-info-buttons');
  const buttonsSaveCancel = document.getElementsByClassName('patients-info-buttons-2');

  const enableEditForm = () => {
    patientsForm.querySelectorAll('.card-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });

    buttonsEditDelete[0].classList.add('disabled');
    buttonsSaveCancel[0].classList.remove('disabled');
  };

  const cancelEditForm = () => {
    patientsForm.querySelectorAll('.card-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonsEditDelete[0].classList.remove('disabled');
    buttonsSaveCancel[0].classList.add('disabled');
  };

  const validateForm = async () => {
    let surname = patientsForm['surname'].value;
    let name = patientsForm['name'].value;
    let patronymic = patientsForm['patronymic'].value;
    let phone = patientsForm['phone'].value;
    let email = patientsForm['email'].value;
    let birthdate = patientsForm['birthdate'].value;
    let address = patientsForm['address'].value;
    if (surname === '' || name === '' || phone === '' || birthdate === '') {
      alert("Заповніть обов'язкові поля: прізвище, ім'я, телефон, дату народження");
      return false;
    }
    if (!phone.match(/^\+380\d{9}$/)) {
      alert('Невірний формат телефону. Введіть у форматі +380123456789');
      return false;
    }
    if (!birthdate.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
      alert('Невірний формат дати народження. Введіть у форматі рррр.мм.дд');
      return false;
    }
    if (!email === '') {
      if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        alert('Невірний формат email');
        return false;
      }
    }
    if (surname.lenght > 80) {
      alert('Прізвище занадто довге');
      return false;
    }
    if (name.lenght > 80) {
      alert("Ім'я занадто довге");
      return false;
    }
    if (patronymic.lenght > 80) {
      alert('По батькові занадто довге');
      return false;
    }
    if (address.lenght > 200) {
      alert('Адреса занадто довга. Приклади: "м. Львів, вул. Шевченка, 1", "м. Київ".');
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
          <form id="patients-info" className="patients-data">
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
            <div className="patients-info-buttons">
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
            <div className="patients-info-buttons-2 disabled">
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
