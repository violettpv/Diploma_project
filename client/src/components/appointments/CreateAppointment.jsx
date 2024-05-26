import React, { useEffect, useState } from 'react';
import '../../css/Appointments.css';
import '../../index.css';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment } from '../../features/appointments/appointmentSlice';
import Button from '../Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  getPatient,
  getPatients,
  findPatient,
  reset as resetPatients,
} from '../../features/patients/patientsSlice';
import { getUsers, reset as resetUsers } from '../../features/user/userSlice';

export default function CreateAppointment() {
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

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [roomNum, setRoomNum] = useState('');
  const [noteData, setNoteData] = useState('');
  // old select-option
  // const [selectedPatient, setSelectedPatient] = useState('');
  // Using for AutoComplete MUI component
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 8; hour <= 21; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(
          2,
          '0'
        )}`;
        times.push(time);
      }
    }
    return times;
  };
  const timeSlots = generateTimeSlots();

  // Using for AutoComplete MUI component
  const handlePatientChange = (event, newValue) => {
    event.preventDefault();
    setSelectedPatient(newValue);
  };

  const handleStartTimeChange = (e) => {
    e.preventDefault();
    setSelectedStartTime(e.target.value);
    setSelectedEndTime('');
  };
  const availableEndTimes = timeSlots.filter((time) => time > selectedStartTime);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      dispatch(
        createAppointment({
          patientUuid: selectedPatient.uuid,
          userUuid: selectedUser,
          date: selectedDate,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          roomNumber: roomNum,
          note: noteData,
        })
      );
      alert('Запис створено');
      navigate('/appointments');
    }
  };

  const validateForm = () => {
    if (
      !selectedPatient ||
      !selectedPatient.uuid ||
      !selectedUser ||
      !selectedDate ||
      !selectedStartTime ||
      !selectedEndTime
    ) {
      alert(
        'Заповніть необхідні поля: пацієнт, лікар, дата, час початку, час завершення, № кабінету.'
      );
      return false;
    }
    if (selectedStartTime >= selectedEndTime) {
      alert('Час початку повинен бути меншим за час завершення');
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="CreateAppointment">
        <Navigator />
        <div className="appointments-content">
          <Header />
          <div className="create-appointment-body">
            <div className="create-appointment-main">
              <div className="create-appointment-intro">Створити новий запис</div>
              <hr className="custom-hr" />
              <form
                name="create-appointment"
                id="create-appointment"
                className="appointment-data"
                onSubmit={handleSubmit}
              >
                <div className="appointment-data-row">
                  <div className="appointment-labels">
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
                    <label htmlFor="roomNum">
                      Кабінет №:
                      <input
                        name="roomNum"
                        type="text"
                        value={roomNum}
                        onChange={(e) => setRoomNum(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
                <div className="appointment-data-row">
                  <div className="appointment-labels">
                    <label htmlFor="startTime">
                      Час початку:
                      <select
                        name="startTime"
                        value={selectedStartTime}
                        onChange={(e) => handleStartTimeChange(e)}
                      >
                        <option value="">Виберіть час</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label htmlFor="endTime">
                      Час завершення:
                      <select
                        name="endTime"
                        value={selectedEndTime}
                        onChange={(e) => setSelectedEndTime(e.target.value)}
                        disabled={!selectedStartTime}
                      >
                        <option value="">Виберіть час</option>
                        {availableEndTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label htmlFor="note">
                      Примітка:
                      <textarea
                        maxLength={255}
                        name="note"
                        type="text"
                        value={noteData}
                        onChange={(e) => setNoteData(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              </form>
              <div className="drecords-buttons">
                <Button
                  form="create-appointment"
                  type="submit"
                  text="Зберегти"
                  color="var(--piction-blue)"
                  onClick={(e) => handleSubmit(e)}
                />
                <Button
                  form="create-appointment"
                  type="button"
                  text="Скасувати"
                  color="gray"
                  onClick={() => navigate('/appointments')}
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
