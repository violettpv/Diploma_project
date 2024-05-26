import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/Dispensary.css';
import '../../index.css';
import Navigator from '../Navigator';
import Header from '../Header';
import Button from '../Button';
import { Autocomplete, TextField } from '@mui/material';
import { createDispensary } from '../../features/dispensary/dispensarySlice';
import {
  getPatients,
  reset as resetPatients,
} from '../../features/patients/patientsSlice';
import { getUsers, reset as resetUsers } from '../../features/user/userSlice';

export default function CreateDispensaryRecord() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    patients,
    isError: isErrorPatients,
    message: messagePatients,
  } = useSelector((state) => state.patients);
  const {
    users,
    isError: isErrorUsers,
    message: messageUsers,
  } = useSelector((state) => state.user);

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [timeData, setTimeData] = useState('');
  const [treatmentData, setTreatmentData] = useState('');
  const [notesData, setNotesData] = useState('');

  useEffect(() => {
    if (isErrorPatients) {
      console.error('Error:', messagePatients);
    }
    if (isErrorUsers) {
      console.error('Error:', messageUsers);
    }

    dispatch(getPatients());
    dispatch(getUsers());

    return () => {
      dispatch(resetPatients());
      dispatch(resetUsers());
    };
  }, [dispatch, isErrorPatients, messagePatients, isErrorUsers, messageUsers]);

  const handlePatientChange = (event, newValue) => {
    event.preventDefault();
    setSelectedPatient(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      dispatch(
        createDispensary({
          patientUuid: selectedPatient.uuid,
          userUuid: selectedUser,
          dateOfTheVisit: selectedDate,
          timeNeeded: timeData,
          treatment: treatmentData,
          notes: notesData,
        })
      );
      alert('Запис в диспансерному обліку створено');
      navigate('/dispensary');
    }
  };

  const validateForm = () => {
    if (
      !selectedPatient ||
      !selectedPatient.uuid ||
      !selectedUser ||
      !selectedDate ||
      !timeData ||
      !treatmentData
    ) {
      alert(
        'Заповніть необхідні поля: пацієнт, лікар, дата, потрібний час, лікування/процедури.'
      );
      return false;
    }
    if (!timeData.match(/^\d{1,2}:\d{2}$/)) {
      alert('Час візиту введено невірно. Введіть у форматі години:хвилини');
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="CreateDispensaryRecord">
        <Navigator />
        <div className="dispensary-content">
          <Header />
          <div className="dispensary-body">
            <div className="create-dispensary-main">
              <div className="dispensary-intro">
                Створити новий запис в диспансерному обліку
              </div>
              <hr className="custom-hr" />
              <form
                name="create-drecord"
                id="create-drecord"
                className="record-data"
                onSubmit={handleSubmit}
              >
                <div className="drecords-data-row">
                  <label htmlFor="patient">
                    <div id="patient-list-label-div">Пацієнт:</div>
                    <Autocomplete
                      sx={patientSelectStylesDisabled}
                      name="patient"
                      id="patient-list"
                      options={patients}
                      getOptionLabel={(option) =>
                        `${option.surname} ${option.name} ${option.patronymic}`
                      }
                      value={selectedPatient}
                      onChange={handlePatientChange}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Виберіть пацієнта" />
                      )}
                    />
                  </label>
                  <label htmlFor="doctor">
                    Лікар:
                    <select
                      id="doctor-list"
                      name="doctor"
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                    >
                      <option value="">Виберіть лікаря</option>
                      {users &&
                        users.length > 0 &&
                        users
                          .filter(
                            (user) => user.role === 'doctor' || user.role === 'main'
                          )
                          .map((user) => (
                            <option key={user.uuid} value={user.uuid}>
                              {user.surname} {user.name}
                            </option>
                          ))}
                    </select>
                  </label>
                  <label htmlFor="date">
                    Дата візиту:
                    <input
                      name="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </label>
                </div>
                <div className="drecords-data-row">
                  <label htmlFor="timeNeeded">
                    Потрібний час для візиту:
                    <input
                      placeholder="гг:хх"
                      name="timeNeeded"
                      type="text"
                      value={timeData}
                      onChange={(e) => setTimeData(e.target.value)}
                    />
                  </label>
                  <label htmlFor="treatment">
                    Лікування / Процедури:
                    <textarea
                      maxLength={200}
                      name="treatment"
                      type="text"
                      value={treatmentData}
                      onChange={(e) => setTreatmentData(e.target.value)}
                    />
                  </label>
                  <label htmlFor="notes">
                    Примітка:
                    <textarea
                      maxLength={200}
                      name="notes"
                      type="text"
                      value={notesData}
                      onChange={(e) => setNotesData(e.target.value)}
                    />
                  </label>
                </div>
              </form>
              <div className="drecords-buttons">
                <Button
                  form="create-drecord"
                  type="submit"
                  text="Створити запис"
                  color="var(--piction-blue)"
                  onClick={(e) => handleSubmit(e)}
                />
                <Button
                  form="create-drecord"
                  type="button"
                  text="Скасувати"
                  color="gray"
                  onClick={() => navigate('/dispensary')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const patientSelectStylesDisabled = {
  '& .MuiInputBase-root': {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    padding: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    // border: 'none',
  },
  '& .MuiAutocomplete-endAdornment': {
    // display: 'none',
    right: 0,
  },
  '& .MuiInputLabel-root': {
    display: 'none',
  },
};
