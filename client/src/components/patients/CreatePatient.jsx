import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/Patients.css';
import '../../index.css';
import Navigator from '../Navigator';
import Header from '../Header';
import Button from '../Button';
import { createPatient } from '../../features/patients/patientsSlice';
import { toast } from 'react-toastify';

export default function CreatePatient() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
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
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const patientFormRef = useRef(null);

  const validateForm = () => {
    let surname = patientFormRef.current['surname'].value;
    let name = patientFormRef.current['name'].value;
    let patronymic = patientFormRef.current['patronymic'].value;
    let phone = patientFormRef.current['phone'].value;
    let birthdate = patientFormRef.current['birthdate'].value;
    let email = patientFormRef.current['email'].value;
    let address = patientFormRef.current['address'].value;

    if (surname === '' || name === '' || phone === '') {
      toast.error("Заповніть обов'язкові поля: прізвище, ім'я, телефон.", {
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
    if (!(birthdate === '' || birthdate === null)) {
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
    if (surname.lenght > 80) {
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
    if (name.lenght > 80) {
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
    if (patronymic.lenght > 80) {
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
    if (address.lenght > 200) {
      toast.error(
        'Адреса занадто довга. Приклади: "м. Львів, вул. Шевченка, 1", "м. Київ".',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      await dispatch(
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
      toast.success('Пацієнта створено', {
        position: 'top-right',
        autoClose: 1200,
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
      setBirthdate('');
      setAddress('');
      setNotes('');
      navigate('/patients');
    } else {
      toast.error(
        'Помилка при створенні пацієнта. Перевірте правильність введених даних.',
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
      <div className="Patients">
        <Navigator />
        <div className="patients-content">
          <Header />
          <div className="create-patient-body">
            <div className="create-patient-main">
              <div className="create-patient-intro">Створити картку пацієнта</div>
              <hr className="custom-hr" />
              <form
                name="create-patient"
                id="create-patient"
                className="patients-data"
                ref={patientFormRef}
              >
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
                      placeholder="Необов'язково. Формат: рррр.мм.дд"
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
                  onClick={() => navigate('/patients')}
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
