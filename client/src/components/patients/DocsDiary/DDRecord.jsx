import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/Patients.css';
import '../../../index.css';
import { toast } from 'react-toastify';
import {
  deleteDocsDiaryRecord,
  getDocsDiaryRecord,
  updateDocsDiaryRecord,
  reset,
} from '../../../features/patients/patientsSlice';
import Button from '../../Button';
import Header from '../../Header';
import Navigator from '../../Navigator';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function TreatmentPlan() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const params = useParams();
  const docsRecordUuid = params.uuid;
  const { ddRecord, isError, message } = useSelector((state) => state.patients);

  const [date, setDate] = useState('');
  const [complaints, setComplaints] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [status, setStatus] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const docsRecordFormRef = useRef(null);
  const buttonUpdateRef = useRef(null);
  const buttonsSaveCancelRef = useRef(null);

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

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

    dispatch(getDocsDiaryRecord(docsRecordUuid));
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, docsRecordUuid, navigate, user]);

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

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const data = {
        uuid: ddRecord.uuid,
        date: date || ddRecord.date,
        complaints: complaints || ddRecord.complaints,
        anamnesis: anamnesis || ddRecord.anamnesis,
        status: status || ddRecord.status,
        diagnosis: diagnosis || ddRecord.diagnosis,
        treatment: treatment || ddRecord.treatment,
        recommendations: recommendations || ddRecord.recommendations,
      };
      await dispatch(updateDocsDiaryRecord(data));
      handleCancel();
      await dispatch(getDocsDiaryRecord(docsRecordUuid));
      toast.success('Запис в щоденнику оновлено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      toast.error(
        'Помилка при оновлені запису в щоденника. Перевірте правильність введених даних.',
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

  const handleDelete = async (e) => {
    e.preventDefault();
    MySwal.fire({
      title: 'Ви впевнені?',
      text: 'Хочете видалити цей запис в щоденнику лікаря?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--piction-blue)',
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDocsDiaryRecord(docsRecordUuid));
        toast.success('Запис щоденнику видалено', {
          position: 'top-right',
          autoClose: 1200,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        // navigate(`/patients/get/${ddRecord.patientUuid}`);
        // navigate(`/patients/card/${ddRecord.patientUuid}`);
        navigate(`/patients/card/${ddRecord.patientUuid}/doctorsDiary`);
      }
    });
  };

  const handleEdit = () => {
    docsRecordFormRef.current.querySelectorAll('.drecord-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });
    buttonUpdateRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
  };

  const handleCancel = () => {
    setDate(ddRecord.date);
    setComplaints(ddRecord.complaints);
    setAnamnesis(ddRecord.anamnesis);
    setStatus(ddRecord.status);
    setDiagnosis(ddRecord.diagnosis);
    setTreatment(ddRecord.treatment);
    setRecommendations(ddRecord.recommendations);
    docsRecordFormRef.current.querySelectorAll('.drecord-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonUpdateRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
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
                <div className="tplan-title">Запису в щоденнику лікаря</div>
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
                    disabled
                    class="drecord-inputs"
                    name="date"
                    type="date"
                    defaultValue={ddRecord.date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="docsrecord-data-rows">
                  <div className="docsrecord-data-row">
                    <label htmlFor="complaints">Скарги:</label>
                    <textarea
                      disabled
                      class="drecord-inputs"
                      name="complaints"
                      type="text"
                      defaultValue={ddRecord.complaints}
                      onChange={(e) => setComplaints(e.target.value)}
                    />
                    <label htmlFor="anamnesis">Анамнез:</label>
                    <textarea
                      disabled
                      class="drecord-inputs"
                      placeholder="Обов'язкове поле"
                      name="anamnesis"
                      type="text"
                      defaultValue={ddRecord.anamnesis}
                      onChange={(e) => setAnamnesis(e.target.value)}
                    />
                    <label htmlFor="status">Статус:</label>
                    <textarea
                      disabled
                      class="drecord-inputs"
                      placeholder="Обов'язкове поле"
                      name="status"
                      type="text"
                      defaultValue={ddRecord.status}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                  </div>
                  <div className="docsrecord-data-row">
                    <label htmlFor="diagnosis">Діагноз:</label>
                    <textarea
                      disabled
                      class="drecord-inputs"
                      name="diagnosis"
                      type="text"
                      defaultValue={ddRecord.diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                    <label htmlFor="treatment">Лікування:</label>
                    <textarea
                      disabled
                      class="drecord-inputs"
                      name="treatment"
                      type="text"
                      defaultValue={ddRecord.treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                    />
                    <label htmlFor="recommendations">Рекомендації:</label>
                    <textarea
                      disabled
                      class="drecord-inputs"
                      name="recommendations"
                      type="text"
                      defaultValue={ddRecord.recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                    />
                  </div>
                </div>
              </form>
              <div className="drecord-buttons-1" ref={buttonUpdateRef}>
                <Button
                  form="tplan-form"
                  type="button"
                  onClick={handleEdit}
                  text="Редагувати"
                  color="var(--piction-blue)"
                />
                <Button
                  form="tplan-form"
                  type="button"
                  onClick={(e) => handleDelete(e)}
                  text="Видалити"
                  color="var(--delete-button-color)"
                />
                <Button
                  form="tplan-form"
                  type="button"
                  onClick={
                    // () => navigate(`/patients/get/${ddRecord.patientUuid}`)
                    // () => navigate(`/patients/card/${ddRecord.patientUuid}`)
                    () => navigate(`/patients/card/${ddRecord.patientUuid}/doctorsDiary`)
                  }
                  text="Назад"
                  color="gray"
                />
              </div>
              <div className="drecord-buttons-2 disabled" ref={buttonsSaveCancelRef}>
                <Button
                  form="tplan-form"
                  type="button"
                  onClick={(e) => onSubmitUpdate(e)}
                  text="Зберегти"
                  color="var(--piction-blue)"
                />
                <Button
                  form="tplan-form"
                  type="button"
                  onClick={handleCancel}
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
