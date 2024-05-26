import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/Patients.css';
import '../../index.css';
import Button from '../Button';
import {
  getForm043,
  updateForm043,
  reset,
  getPatient,
} from '../../features/patients/patientsSlice';
import { getMe } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Form043({ uuid }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patient, form043, isError, message } = useSelector((state) => state.patients);

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const form043Uuid = form043.uuid;
  const [diagnosis, setDiagnosis] = useState('');
  const [complaints, setComplaints] = useState('');
  const [transferredAndAssociatedDiseases, setTransferredAndAssociatedDiseases] =
    useState('');
  const [occlusion, setOcclusion] = useState('');
  const [medicalExaminationData, setMedicalExaminationData] = useState('');
  const [researchData, setResearchData] = useState('');
  const [vitaScale, setVitaScale] = useState('');
  const [oralHealthTrainingData, setOralHealthTrainingData] = useState('');
  const [oralHygieneControlData, setOralHygieneControlData] = useState('');

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }

    if (!user || !(user.role === 'doctor' || user.role === 'main')) {
      navigate('/');
      alert('У вас немає доступу до цієї сторінки');
    }

    dispatch(getPatient(uuid));
    dispatch(getForm043(uuid));
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, uuid]);

  if (!form043) {
    return <div>Loading...</div>;
  }

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const data = {
      uuid: form043Uuid,
      diagnosis: diagnosis || form043.diagnosis,
      complaints: complaints || form043.complaints,
      transferredAndAssociatedDiseases:
        transferredAndAssociatedDiseases || form043.transferredAndAssociatedDiseases,
      occlusion: occlusion || form043.occlusion,
      medicalExaminationData: medicalExaminationData || form043.medicalExaminationData,
      researchData: researchData || form043.researchData,
      vitaScale: vitaScale || form043.vitaScale,
      oralHealthTrainingData: oralHealthTrainingData || form043.oralHealthTrainingData,
      oralHygieneControlData: oralHygieneControlData || form043.oralHygieneControlData,
    };
    dispatch(updateForm043(data));
    alert(`Дані форми 043/о пацієнта ${patient.surname} ${patient.name} оновлено`);
    cancelEditForm();
    dispatch(getForm043(uuid));
  };

  const form043Form = document.getElementById('form043');
  const buttonUpdate = document.getElementsByClassName('form043-buttons-1');
  const buttonsSaveCancel = document.getElementsByClassName('form043-buttons-2');

  const enableEditForm = () => {
    form043Form.querySelectorAll('.form043-textarea').forEach((textarea) => {
      textarea.removeAttribute('disabled');
    });
    buttonUpdate[0].classList.add('disabled');
    buttonsSaveCancel[0].classList.remove('disabled');
  };

  const cancelEditForm = () => {
    form043Form.querySelectorAll('.form043-textarea').forEach((textarea) => {
      textarea.setAttribute('disabled', '');
    });
    buttonUpdate[0].classList.remove('disabled');
    buttonsSaveCancel[0].classList.add('disabled');
  };

  return (
    <>
      <div className="PatientsInfo">
        <div className="patients-info-main">
          <div className="form043-header">
            <div className="form043-info">
              Форма 043/о ({patient.surname} {patient.name} {patient.patronymic})
            </div>
            <div className="form043-buttons">
              <div className="form043-buttons-1">
                <Button
                  form="form043"
                  type="button"
                  onClick={enableEditForm}
                  text="Редагувати"
                  color="var(--piction-blue)"
                />
              </div>
              <div className="form043-buttons-2 disabled">
                <Button
                  form="form043"
                  type="button"
                  onClick={(e) => onSubmitUpdate(e)}
                  text="Зберегти"
                  color="var(--piction-blue)"
                />
                <Button
                  form="form043"
                  type="button"
                  text="Скасувати"
                  color="gray"
                  onClick={cancelEditForm}
                />
              </div>
            </div>
          </div>
          <hr className="custom-hr" />
          <div className="form043-main">
            <form id="form043">
              <label>
                <span>Діагноз:</span>
                <textarea
                  name="diagnosis"
                  disabled
                  className="form043-textarea"
                  defaultValue={form043.diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </label>
              <label>
                <span>Скарги:</span>
                <textarea
                  name="complaints"
                  disabled
                  className="form043-textarea"
                  defaultValue={form043.complaints}
                  onChange={(e) => setComplaints(e.target.value)}
                />
              </label>
              <label>
                <span>Перенесені та супутні захворювання:</span>
                <textarea
                  name="transferredAndAssociatedDiseases"
                  disabled
                  className="form043-textarea"
                  defaultValue={form043.transferredAndAssociatedDiseases}
                  onChange={(e) => setTransferredAndAssociatedDiseases(e.target.value)}
                />
              </label>
              <label>
                <span>Прикус:</span>
                <textarea
                  name="occlusion"
                  disabled
                  className="form043-textarea"
                  defaultValue={form043.occlusion}
                  onChange={(e) => setOcclusion(e.target.value)}
                />
              </label>
              <label>
                <span>
                  Стан гігієни порожнини рота, стан слизової оболонки порожнини рота,
                  ясен, альвеолярних відростків та піднебіння. Індекси ГІ та РМА:
                </span>
                <textarea
                  name="medicalExaminationData"
                  disabled
                  className="form043-textarea"
                  defaultValue={form043.medicalExaminationData}
                  onChange={(e) => setMedicalExaminationData(e.target.value)}
                />
              </label>
              <label>
                <span>Дані рентгенівських, лабораторних досліджень:</span>
                <textarea
                  name="researchData"
                  disabled
                  className="form043-textarea"
                  defaultValue={form043.researchData}
                  onChange={(e) => setResearchData(e.target.value)}
                />
              </label>
              <label>
                <span>Колір за шкалою "Віта":</span>
                <textarea
                  name="vitaScale"
                  disabled
                  className="form043-textarea"
                  defaultValue={form043.vitaScale}
                  onChange={(e) => setVitaScale(e.target.value)}
                />
              </label>
              <label>
                <span>Дані навчання навичкам гігієни порожнини рота:</span>
                <textarea
                  name="oralHealthTrainingData"
                  disabled
                  className="form043-textarea"
                  defaultValue={form043.oralHealthTrainingData}
                  onChange={(e) => setOralHealthTrainingData(e.target.value)}
                />
              </label>
              <label>
                <span>Дані контролю гігієни порожнини рота:</span>
                <textarea
                  name="oralHygieneControlData"
                  disabled
                  className="form043-textarea"
                  defaultValue={form043.oralHygieneControlData}
                  onChange={(e) => setOralHygieneControlData(e.target.value)}
                />
              </label>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
