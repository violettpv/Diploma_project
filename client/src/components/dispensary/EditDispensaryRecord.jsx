import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Dispensary.css';
import '../../index.css';
import Navigator from '../Navigator';
import Header from '../Header';
import Button from '../Button';
import {
  updateDispensary,
  getDispensary,
  reset,
} from '../../features/dispensary/dispensarySlice';
import { getUsers, reset as resetUsers } from '../../features/user/userSlice';

export default function EditDispensaryRecord() {
  const params = useParams();
  const dispensaryUuid = params.uuid;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    users,
    isError: isErrorUsers,
    message: messageUsers,
  } = useSelector((state) => state.user);
  const { oneDispensary, isError, message } = useSelector((state) => state.dispensary);

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [timeData, setTimeData] = useState('');
  const [treatmentData, setTreatmentData] = useState('');
  const [notesData, setNotesData] = useState('');

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }
    if (isErrorUsers) {
      console.error('Error:', messageUsers);
    }

    dispatch(getUsers());
    dispatch(getDispensary(dispensaryUuid));

    return () => {
      dispatch(resetUsers());
      dispatch(reset());
    };
  }, [dispatch, isErrorUsers, messageUsers, isError, message]);

  useEffect(() => {
    setSelectedUser(oneDispensary.userUuid);
    setSelectedDate(oneDispensary.dateOfTheVisit);
    setTimeData(oneDispensary.timeNeeded);
    setTreatmentData(oneDispensary.treatment);
    setNotesData(oneDispensary.notes);
  }, [oneDispensary]);

  if (!oneDispensary) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      dispatch(
        updateDispensary({
          uuid: dispensaryUuid,
          // patientUuid: selectedPatient.uuid,
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
    if (!selectedUser || !selectedDate || !timeData || !treatmentData) {
      alert('Заповніть необхідні поля: лікар, дата, потрібний час, лікування/процедури.');
      return false;
    }
    if (!timeData.match(/^\d{1,2}:\d{2}$/)) {
      alert('Час візиту введено невірно. Введіть у форматі години:хвилини');
      return false;
    }
    return true;
  };

  return (
    <div className="EditDispensaryRecord">
      <Navigator />
      <div className="dispensary-content">
        <Header />
        <div className="dispensary-body">
          <div className="create-dispensary-main">
            <div className="dispensary-intro">
              Редагувати запис в диспансерному обліку
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
                  <div>Пацієнт:</div>
                  {oneDispensary.patient && (
                    <input
                      id="edit-record-patient-input"
                      name="patient"
                      readOnly
                      value={`${oneDispensary.patient.surname} ${oneDispensary.patient.name} ${oneDispensary.patient.patronymic}`}
                    />
                  )}
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
                        .filter((user) => user.roles.length > 0)
                        .filter(
                          (user) =>
                            user.roles[0].role === 'doctor' ||
                            user.roles[0].role === 'main'
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
                text="Оновити запис"
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
  );
}
