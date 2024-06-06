import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/Patients.css';
import '../../../index.css';
import { toast } from 'react-toastify';
import {
  createDocsDiaryRecord,
  getPatient,
  reset,
} from '../../../features/patients/patientsSlice';
import Button from '../../Button';
import Header from '../../Header';
import Navigator from '../../Navigator';

export default function CreateDDRecord() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const patientUuid = params.uuid;

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { patient, isError, message } = useSelector((state) => state.patients);

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

    if (!user || !(user.role === 'doctor' || user.role === 'main')) {
      navigate('/patients');
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
    }

    dispatch(getPatient(patientUuid));
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, patientUuid]);

  const [date, setDate] = useState('');
  const [complaints, setComplaints] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [status, setStatus] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const docsRecordFormRef = useRef(null);
  const buttonsSaveCancelRef = useRef(null);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(`/patients/get/${patientUuid}`);
  };

  const validateForm = () => {
    let date = docsRecordFormRef.current.date.value;
    let anamnesis = docsRecordFormRef.current.anamnesis.value;
    let status = docsRecordFormRef.current.status.value;

    if (anamnesis === '' || anamnesis === null) {
      toast.error("Заповніть обов'язкові поля: дата, анамнезис, статус", {
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

    if (status === '' || status === null) {
      toast.error("Заповніть обов'язкові поля: дата, анамнезис, статус", {
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
    if (date === '' || date === null) {
      toast.error('Введіть дату у форматі рррр.мм.дд', {
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
    if (!(date === '' || date === null)) {
      if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        toast.error('Невірний формат дати. Введіть у форматі рррр.мм.дд', {
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
    return true;
  };

  const onSubmitCreate = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const data = {
        patientUuid: patientUuid,
        date: date,
        complaints: complaints,
        anamnesis: anamnesis,
        status: status,
        diagnosis: diagnosis,
        treatment: treatment,
        recommendations: recommendations,
      };
      await dispatch(createDocsDiaryRecord(data));
      toast.success('Запис в щоденнику лікаря створено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      navigate(`/patients/get/${patientUuid}`);
    } else {
      toast.error(
        'Помилка при створенні запису в щоденнику лікаря. Перевірте правильність введених даних.',
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
      <div className="CreateDDRecord">
        <Navigator />
        <div className="docsrecord-content">
          <Header />
          <div className="docsrecord-body">
            <div className="docsrecord-main">
              <div className="tplan-fullname">
                <div className="tplan-title">
                  Створення запису в щоденнику лікаря (Пацієнт: {patient?.surname}{' '}
                  {patient?.name} {patient?.patronymic})
                </div>
                <hr className="custom-hr" />
              </div>
              <form
                id="create-docsrecord"
                name="create-docsrecord"
                ref={docsRecordFormRef}
              >
                <div className="docsrecord-date-row">
                  <label htmlFor="date">Дата:</label>
                  <input
                    name="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="docsrecord-data-rows">
                  <div className="docsrecord-data-row">
                    <label htmlFor="complaints">Скарги:</label>
                    <textarea
                      name="complaints"
                      type="text"
                      value={complaints}
                      onChange={(e) => setComplaints(e.target.value)}
                    />
                    <label htmlFor="anamnesis">Анамнез:</label>
                    <textarea
                      placeholder="Обов'язкове поле"
                      name="anamnesis"
                      type="text"
                      value={anamnesis}
                      onChange={(e) => setAnamnesis(e.target.value)}
                    />
                    <label htmlFor="status">Статус:</label>
                    <textarea
                      placeholder="Обов'язкове поле"
                      name="status"
                      type="text"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                  </div>
                  <div className="docsrecord-data-row">
                    <label htmlFor="diagnosis">Діагноз:</label>
                    <textarea
                      name="diagnosis"
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                    <label htmlFor="treatment">Лікування:</label>
                    <textarea
                      name="treatment"
                      type="text"
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                    />
                    <label htmlFor="recommendations">Рекомендації:</label>
                    <textarea
                      name="recommendations"
                      type="text"
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                    />
                  </div>
                </div>
              </form>
              <div className="docsrecord-buttons" ref={buttonsSaveCancelRef}>
                <Button
                  form="create-docsrecord"
                  type="button"
                  onClick={(e) => onSubmitCreate(e)}
                  text="Створити"
                  color="var(--piction-blue)"
                />
                <Button
                  form="create-docsrecord"
                  type="button"
                  onClick={(e) => handleCancel(e)}
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
