import React, { useEffect, useState } from 'react';
import '../../css/MailingSystem.css';
import '../../css/Appointments.css';
import '../../css/Services.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendReminders,
  reset,
  getAppointmentsByDate,
} from '../../features/mailingsystem/msysSlice';

export default function MSysInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { reminders, isError, message } = useSelector((state) => state.msystem);

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const getNextDay = () => {
    const today = new Date();
    const day = String(today.getDate() + 1).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return { day, month, year };
  };

  const [selectedDate, setSelectedDate] = useState(getNextDay());
  const [selectedAppointments, setSelectedAppointments] = useState([]);

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

    const { day, month, year } = selectedDate;
    dispatch(getAppointmentsByDate({ date: day, month, year }));

    return () => {
      dispatch(reset());
    };
  }, [selectedDate, dispatch, isError, message]);

  const handleSearchDate = (e) => {
    e.preventDefault();
    const selectedDate = document.getElementById('search-date').value;
    const [year, month, day] = selectedDate.split('-');
    setSelectedDate({ day, month, year });
    dispatch(getAppointmentsByDate({ date: day, month, year }));
  };

  const handleAppointmentSelection = (appointment) => {
    setSelectedAppointments((prevSelected) => {
      if (prevSelected.includes(appointment)) {
        return prevSelected.filter((item) => item !== appointment);
      } else {
        return [...prevSelected, appointment];
      }
    });
  };

  const handleSendReminders = (e) => {
    e.preventDefault();
    const selectedAppointmentsData = selectedAppointments.map((appointment) => ({
      ...appointment,
      patient: reminders.appointments.find((a) => a.uuid === appointment.uuid).patient,
    }));

    let convertDateInString =
      selectedDate.year + '-' + selectedDate.month + '-' + selectedDate.day;

    dispatch(
      sendReminders({
        currentDate: convertDateInString,
        appointments: selectedAppointmentsData,
      })
    );
    toast.success('Нагадування відправлено', {
      position: 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    setSelectedAppointments([]);
  };

  return (
    <>
      <div className="MSysInfo">
        <div className="msys-info-main">
          <div className="msys-header">
            <div className="search-date">
              <input
                type="date"
                name="date"
                id="search-date"
                defaultValue={`${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`}
              />
              <button
                className="appointments-buttons"
                type="button"
                onClick={(e) => handleSearchDate(e)}
              >
                Пошук записів
              </button>
            </div>
            <div className="add-service">
              <button
                className="appointments-buttons"
                type="button"
                onClick={(e) => handleSendReminders(e)}
              >
                Відправити нагадування
              </button>
            </div>
          </div>
          <div className="msys-table-block">
            <TableContainer className="msys-table-container">
              <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: '8%' }}>
                      Обрати
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Пацієнт</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Пошта</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Час
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reminders.appointments &&
                    reminders.appointments.length > 0 &&
                    reminders.appointments.map((appointment) => (
                      <TableRow key={appointment.uuid}>
                        <TableCell align="center">
                          <Checkbox
                            checked={selectedAppointments.includes(appointment)}
                            onChange={() => handleAppointmentSelection(appointment)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ cursor: 'pointer' }}
                          onClick={() =>
                            // navigate(`/patients/get/${appointment.patient.uuid}`)
                            navigate(`/patients/card/${appointment.patient.uuid}`)
                          }
                        >
                          {appointment.patient.surname} {appointment.patient.name}{' '}
                          {appointment.patient.patronymic}
                        </TableCell>
                        <TableCell>
                          {appointment.patient.email
                            ? appointment.patient.email
                            : 'Відсутня'}
                        </TableCell>
                        <TableCell align="center">
                          {appointment.startTime.slice(0, 5)} -{' '}
                          {appointment.endTime.slice(0, 5)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
