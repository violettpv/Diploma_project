import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Patients.css';
import '../../index.css';
import { toast } from 'react-toastify';
import Button from '../Button';
import Header from '../Header';
import Navigator from '../Navigator';
import {
  getTreatmentPlan,
  updateTreatmentPlan,
  deleteTreatmentPlan,
  reset,
} from '../../features/patients/patientsSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function TreatmentPlan() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const params = useParams();
  const treatmentPlanUuid = params.uuid;
  const { tPlan, isError, message } = useSelector((state) => state.patients);

  const [date, setDate] = useState('');
  const [examination, setExamination] = useState('');
  const [treatment, setTreatment] = useState('');

  const treatmentPlanFormRef = useRef(null);
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

    if (user && (user.role === 'doctor' || user.role === 'main')) {
      dispatch(getTreatmentPlan(treatmentPlanUuid));
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
      navigate(`/patients/card/${tPlan.patientUuid}/info`);
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, treatmentPlanUuid, navigate, user]);

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
        uuid: tPlan.uuid,
        date: date || tPlan.date,
        examination: examination || tPlan.examination,
        treatment: treatment || tPlan.treatment,
      };
      await dispatch(updateTreatmentPlan(data));
      handleCancel();
      await dispatch(getTreatmentPlan(treatmentPlanUuid));
      toast.success('План лікування оновлено', {
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
        'Помилка при оновлені плану лікування. Перевірте правильність введених даних.',
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
      text: 'Хочете видалити цей план лікування?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--piction-blue)',
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTreatmentPlan(treatmentPlanUuid));
        toast.success('План лікування видалено', {
          position: 'top-right',
          autoClose: 1200,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        // navigate(`/patients/get/${tPlan.patientUuid}`);
        // navigate(`/patients/card/${tPlan.patientUuid}`);
        navigate(`/patients/card/${tPlan.patientUuid}/treatmentPlans`);
      }
    });
  };

  const handleEdit = () => {
    treatmentPlanFormRef.current.querySelectorAll('.tplan-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });
    buttonUpdateRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
  };

  const handleCancel = () => {
    setDate(tPlan.date);
    setExamination(tPlan.examination);
    setTreatment(tPlan.treatment);
    treatmentPlanFormRef.current.querySelectorAll('.tplan-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonUpdateRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
  };

  return (
    <>
      <div className="TreatmentPlan">
        <Navigator />
        <div className="tplan-content">
          <Header />
          <div className="tplan-body">
            <div className="tplan-main">
              <div className="tplan-fullname">
                <div className="tplan-title">План лікування</div>
                <hr className="custom-hr" />
              </div>
              <form id="tplan-form" name="tplan-form" ref={treatmentPlanFormRef}>
                <div className="tplan-data-row">
                  <label htmlFor="date">Дата:</label>
                  <input
                    disabled
                    className="tplan-inputs"
                    name="date"
                    type="date"
                    defaultValue={tPlan.date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="tplan-data-row">
                  <label htmlFor="examination">План обстеження:</label>
                  <textarea
                    disabled
                    className="tplan-inputs"
                    name="examination"
                    type="text"
                    defaultValue={tPlan.examination}
                    onChange={(e) => setExamination(e.target.value)}
                  />
                </div>
                <div className="tplan-data-row">
                  <label htmlFor="treatment">План лікування:</label>
                  <textarea
                    disabled
                    className="tplan-inputs"
                    name="treatment"
                    type="text"
                    defaultValue={tPlan.treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                  />
                </div>
              </form>
              <div className="tplan-buttons-1" ref={buttonUpdateRef}>
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
                    //() => navigate(`/patients/get/${tPlan.patientUuid}`)
                    // () => navigate(`/patients/card/${tPlan.patientUuid}`)
                    () => navigate(`/patients/card/${tPlan.patientUuid}/treatmentPlans`)
                  }
                  text="Назад"
                  color="gray"
                />
              </div>
              <div className="tplan-buttons-2 disabled" ref={buttonsSaveCancelRef}>
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
