import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Patients.css';
import '../../index.css';
import { toast } from 'react-toastify';
import {
  createTreatmentPlan,
  getPatient,
  reset,
} from '../../features/patients/patientsSlice';
import Button from '../Button';
import Header from '../Header';
import Navigator from '../Navigator';

export default function CreateTreatmentPlan() {
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

    if (user && (user.role === 'doctor' || user.role === 'main')) {
      dispatch(getPatient(patientUuid));
    } else {
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
      navigate(`/patients/card/${patientUuid}/info`);
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, patientUuid]);

  const [date, setDate] = useState('');
  const [examination, setExamination] = useState('');
  const [treatment, setTreatment] = useState('');

  const treatmentPlanFormRef = useRef(null);
  const buttonsSaveCancelRef = useRef(null);

  const handleCancel = (e) => {
    e.preventDefault();
    // navigate(`/patients/get/${patientUuid}`);
    // navigate(`/patients/card/${patientUuid}`);
    navigate(`/patients/card/${patientUuid}/treatmentPlans`);
  };

  const validateForm = () => {
    let date = treatmentPlanFormRef.current.date.value;
    let treatment = treatmentPlanFormRef.current.treatment.value;

    if (treatment === '' || treatment === null) {
      toast.error("Заповніть обов'язкові поля: дата та лікування", {
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
        examination: examination,
        treatment: treatment,
      };
      await dispatch(createTreatmentPlan(data));
      toast.success('План лікування створено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      // navigate(`/patients/get/${patientUuid}`);
      // navigate(`/patients/card/${patientUuid}`);
      navigate(`/patients/card/${patientUuid}/treatmentPlans`);
    } else {
      toast.error(
        'Помилка при створенні плану лікування. Перевірте правильність введених даних.',
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
      <div className="CreateTreatmentPlan">
        <Navigator />
        <div className="tplan-content">
          <Header />
          <div className="tplan-body">
            <div className="tplan-main">
              <div className="tplan-fullname">
                <div className="tplan-title">
                  Створення плану лікування (Пацієнт: {patient?.surname} {patient?.name}{' '}
                  {patient?.patronymic}){patient?.patronymic}
                </div>
                <hr className="custom-hr" />
              </div>
              <form id="create-tplan" name="create-tplan" ref={treatmentPlanFormRef}>
                <div className="tplan-data-row">
                  <label htmlFor="date">Дата:</label>
                  <input
                    name="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="tplan-data-row">
                  <label htmlFor="examination">План обстеження:</label>
                  <textarea
                    name="examination"
                    type="text"
                    value={examination}
                    onChange={(e) => setExamination(e.target.value)}
                  />
                </div>
                <div className="tplan-data-row">
                  <label htmlFor="treatment">План лікування:</label>
                  <textarea
                    name="treatment"
                    type="text"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                  />
                </div>
              </form>
              <div className="tplan-buttons" ref={buttonsSaveCancelRef}>
                <Button
                  form="create-tplan"
                  type="button"
                  onClick={(e) => onSubmitCreate(e)}
                  text="Створити"
                  color="var(--piction-blue)"
                />
                <Button
                  form="create-tplan"
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
