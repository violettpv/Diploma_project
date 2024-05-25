import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/Patients.css';
import '../../index.css';
import Navigator from '../Navigator';
import Header from '../Header';
import Button from '../Button';
import { createPatient } from '../../features/patients/patientsSlice';

export default function CreatePatient() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const validateForm = async () => {
    let surname = document.forms['create-patient']['surname'].value;
    let name = document.forms['create-patient']['name'].value;
    let patronymic = document.forms['create-patient']['patronymic'].value;
    let phone = document.forms['create-patient']['phone'].value;
    let birthdate = document.forms['create-patient']['birthdate'].value;
    let email = document.forms['create-patient']['email'].value;
    let address = document.forms['create-patient']['address'].value;
    if (surname === '' || name === '' || phone === '') {
      alert("Заповніть обов'язкові поля: прізвище, ім'я, телефон.");
      return false;
    }
    if (!phone.match(/^\+380\d{9}$/)) {
      alert('Невірний формат телефону. Введіть у форматі +380123456789');
      return false;
    }
    if (!(birthdate === '' || birthdate === null)) {
      if (!birthdate.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
        alert('Невірний формат дати народження. Введіть у форматі рррр.мм.дд');
        return false;
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      dispatch(
        createPatient({
          surname,
          name,
          patronymic,
          phone,
          email,
          birthdate,
          address,
          notes,
        })
      );
      alert('Пацієнта створено');
      setSurname('');
      setName('');
      setPatronymic('');
      setPhone('');
      setEmail('');
      setBirthdate('');
      setAddress('');
      setNotes('');
      navigate('/patients');
    } else {
      alert('Помилка при створенні пацієнта. Перевірте правильність введених даних.');
    }
  };

  return (
    <>
      <div className="Patients">
        <Navigator />
        <div className="patients-content">
          <Header />
          <div className="create-patient-body">
            <div className="create-patient-main">
              <div className="create-patient-intro">Створити картку пацієнта</div>
              <hr className="custom-hr" />
              <form name="create-patient" id="create-patient" className="patients-data">
                <div className="patients-data-row">
                  <label>
                    <span>Прізвище:</span>
                    <input
                      name="surname"
                      type="text"
                      className="card-inputs"
                      placeholder="Введіть прізвище"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Ім'я:</span>
                    <input
                      name="name"
                      type="text"
                      className="card-inputs"
                      placeholder="Введіть ім'я"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>По батькові:</span>
                    <input
                      name="patronymic"
                      type="text"
                      className="card-inputs"
                      placeholder="Необов'язково"
                      value={patronymic}
                      onChange={(e) => setPatronymic(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Телефон:</span>
                    <input
                      name="phone"
                      type="text"
                      className="card-inputs"
                      placeholder="Формат: +380123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>
                </div>
                <div className="patients-data-row">
                  <label>
                    <span>Email:</span>
                    <input
                      autoComplete="off"
                      name="email"
                      type="text"
                      className="card-inputs"
                      placeholder="Необов'язково. Розсилки будуть недоступні"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Дата народження:</span>
                    <input
                      name="birthdate"
                      type="text"
                      className="card-inputs"
                      placeholder="Формат: рррр.мм.дд"
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Адреса:</span>
                    <input
                      name="address"
                      type="text"
                      className="card-inputs"
                      placeholder="Необов'язково"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Примітки:</span>
                    <textarea
                      className="card-inputs"
                      placeholder="Необов'язково"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </label>
                </div>
              </form>
              <div className="create-patient-buttons">
                <Button
                  form="create-patient"
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                  text="Створити"
                  color="var(--piction-blue)"
                />
                <Button
                  form="create-patient"
                  type="button"
                  onClick={() => navigate('/appointments')}
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