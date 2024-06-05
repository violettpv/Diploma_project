import React, { useEffect, useState } from 'react';
import '../../css/Appointments.css';
import '../../index.css';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button';
import { toast } from 'react-toastify';
import {
  getAppointment,
  updateAppointment,
  reset,
} from '../../features/appointments/appointmentSlice';
import { getUsers, reset as resetUsers } from '../../features/user/userSlice';

export default function EditAppointment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const appointmentUuid = params.uuid;
  const {
    users,
    isError: isErrorUsers,
    message: messageUsers,
  } = useSelector((state) => state.user);
  const { oneAppointment, isError, message } = useSelector((state) => state.appointments);

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const [appointmentData, setAppointmentData] = useState({
    doctor: '',
    date: '',
    startTime: '',
    endTime: '',
    roomNum: '',
    note: '',
  });
  const { doctor, date, startTime, endTime, roomNum, note } = appointmentData;

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
    if (isErrorUsers) {
      toast.error(messageUsers, {
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

    dispatch(getUsers());
    dispatch(getAppointment(appointmentUuid));

    return () => {
      dispatch(resetUsers());
      dispatch(reset());
    };
  }, [dispatch, isError, message, isErrorUsers, messageUsers]);

  useEffect(() => {
    setAppointmentData({
      // patientUuid: oneAppointment.patient,
      doctor: oneAppointment.userUuid,
      date: oneAppointment.date,
      startTime: oneAppointment.startTime,
      endTime: oneAppointment.endTime,
      roomNum: oneAppointment.roomNumber,
      note: oneAppointment.note,
    });
  }, [oneAppointment]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let doctor = appointmentData.doctor;
    let date = appointmentData.date;
    let startTime = appointmentData.startTime;
    let endTime = appointmentData.endTime;
    let roomNum = appointmentData.roomNum;
    let note = appointmentData.note;
    if (
      doctor === '' ||
      date === '' ||
      startTime === '' ||
      endTime === '' ||
      roomNum === ''
    ) {
      toast.error(
        'Заповніть обов’язкові поля: лікар, дата візиту, час початку, час завершення, кабінет.',
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
    if (note.length > 255) {
      toast.error('Примітка занадто довга. Максимальна довжина 255 символів.', {
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
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let isValid = await validateForm();
    if (isValid) {
      const data = {
        uuid: appointmentUuid,
        userUuid: appointmentData.doctor,
        date: appointmentData.date,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        roomNumber: appointmentData.roomNum,
        note: appointmentData.note,
      };
      await dispatch(updateAppointment(data));
      toast.success('Запис оновлено', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      navigate('/appointments');
    } else {
      toast.error(
        'Помилка при оновленні запису. Перевірте правильність введених даних.',
        {
          position: 'top-right',
          autoClose: 1700,
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

  const availableEndTimes = timeSlots.filter((time) => time > startTime);

  return (
    <>
      <div className="Appointments">
        <Navigator />
        <div className="appointments-content">
          <Header />
          <div className="create-appointment-body">
            <div className="create-appointment-main">
              <div className="create-appointment-intro">Редагувати запис</div>
              <hr className="custom-hr" />
              <form
                name="edit-appointment"
                id="edit-appointment"
                className="appointment-data"
              >
                <div className="appointment-data-row">
                  <div className="appointment-labels">
                    <label for="patient">
                      Пацієнт:
                      {oneAppointment.patient && (
                        <input
                          type="text"
                          name="patient"
                          value={`${oneAppointment.patient.surname} ${oneAppointment.patient.name} ${oneAppointment.patient.patronymic}`}
                          readOnly
                        />
                      )}
                    </label>
                    <label for="doctor">
                      Лікар:
                      <select
                        id="doctor-list"
                        name="doctor"
                        value={appointmentData.doctor}
                        onChange={onChange}
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
                    <label for="date">
                      Дата візиту:
                      <input
                        name="date"
                        type="date"
                        value={oneAppointment.date}
                        onChange={onChange}
                      />
                    </label>
                    <label for="roomNum">
                      Кабінет №:
                      <input
                        name="roomNum"
                        type="text"
                        defaultValue={oneAppointment.roomNumber}
                        onChange={onChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="appointment-data-row">
                  <div className="appointment-labels">
                    <label for="startTime">
                      Час початку:
                      <select
                        name="startTime"
                        defaultValue={oneAppointment.startTime}
                        onChange={onChange}
                      >
                        <option value="">
                          {oneAppointment.startTime &&
                            oneAppointment.startTime.slice(0, 5)}
                        </option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label for="endTime">
                      Час завершення:
                      <select
                        name="endTime"
                        defaultValue={oneAppointment.endTime}
                        onChange={onChange}
                        disabled={!startTime}
                      >
                        <option value="">
                          {oneAppointment.endTime && oneAppointment.endTime.slice(0, 5)}
                        </option>
                        {availableEndTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label for="note">
                      Примітка:
                      <textarea
                        maxLength={255}
                        name="note"
                        type="text"
                        defaultValue={oneAppointment.note}
                        onChange={onChange}
                      />
                    </label>
                  </div>
                </div>
              </form>
              <div className="appointment-buttons">
                <Button
                  form="edit-patient"
                  type="submit"
                  text="Зберегти"
                  color="var(--piction-blue)"
                  onClick={(e) => handleUpdate(e)}
                />
                <Button
                  form="edit-patient"
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
