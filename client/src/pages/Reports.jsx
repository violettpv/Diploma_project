import React, { useEffect, useState } from 'react';
import '../css/Reports.css';
import '../index.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from '@mui/material';
import {
  getFinishedAppointments,
  reset,
} from '../features/appointments/appointmentSlice';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { appointments, isError, message } = useSelector((state) => state.appointments);

  const getToday = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return { day, month, year };
  };

  const [selectedDate, setSelectedDate] = useState(getToday());

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
    dispatch(getFinishedAppointments({ date: day, month, year }));

    return () => {
      dispatch(reset());
    };
  }, [selectedDate, dispatch, isError, message]);

  if (!appointments) {
    return <div>Loading...</div>;
  }

  const handleSearchDate = (e) => {
    e.preventDefault();
    const selectedDate = document.getElementById('search-reports').value;
    const [year, month, day] = selectedDate.split('-');
    setSelectedDate({ day, month, year });
  };

  return (
    <>
      <div className="Reports">
        <Navigator />
        <div className="reports-content">
          <Header />
          <div className="reports-body">
            <div className="reports-main">
              <div className="reports-header">
                <div id="reports-title">Звіти</div>
                <div className="search-date-reports">
                  <input
                    type="date"
                    name="date"
                    id="search-reports"
                    defaultValue={`${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`}
                  />
                  <button type="button" onClick={(e) => handleSearchDate(e)}>
                    Пошук звітів
                  </button>
                </div>
              </div>
              <div className="reports-table-div">
                <TableContainer
                  className="reports-table"
                  component={Paper}
                  sx={{ boxShadow: 'none', border: 'none' }}
                >
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Пацієнт</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Лікар</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Сума</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Тип оплати</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Знижка</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.appointments &&
                        appointments.appointments.length > 0 &&
                        appointments.appointments.map((appointment) => (
                          <TableRow key={appointment.uuid}>
                            <TableCell>
                              {appointment.patient.surname} {appointment.patient.name}{' '}
                              {appointment.patient.patronymic}
                            </TableCell>
                            <TableCell>
                              {appointment.user.surname} {appointment.user.name}
                            </TableCell>
                            <TableCell>
                              {appointment &&
                              appointment.receipt &&
                              appointment.receipt.total
                                ? appointment.receipt.total
                                : '0'}
                              {' грн. '}
                            </TableCell>
                            <TableCell>
                              {' '}
                              {appointment &&
                              appointment.receipt &&
                              appointment.receipt.paymentType
                                ? appointment.receipt.paymentType === 'cash'
                                  ? 'Готівка'
                                  : appointment.receipt.paymentType === 'card'
                                  ? 'Картка'
                                  : '-'
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {' '}
                              {appointment &&
                              appointment.receipt &&
                              appointment.receipt.sale
                                ? appointment.receipt.sale
                                : '0'}
                              {' % '}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter sx={footerSticky}>
                      <TableRow>
                        <TableCell sx={footerStyles}>
                          Сума оплат карткою: {appointments.totalSumCard} грн.
                        </TableCell>
                        <TableCell sx={footerStyles}>
                          Сума оплат готівкою: {appointments.totalSumCash} грн.
                        </TableCell>
                        <TableCell sx={footerStyles}>
                          Повна сума за день: {appointments.totalSum} грн.
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const footerSticky = {
  position: 'sticky',
  bottom: 0,
  backgroundColor: 'white',
};
const footerStyles = {
  color: 'black',
  fontSize: '14px',
  fontWeight: 'bold',
};
