import React, { useEffect, useState } from 'react';
import '../css/Appointments.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt, FaEdit } from 'react-icons/fa';
import { MdOutlinePayments } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAppointments,
  getAppointment,
  deleteAppointment,
  reset,
} from '../features/appointments/appointmentSlice';

export default function Appointments() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

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
    dispatch(getAppointments({ date: day, month, year }));

    return () => {
      dispatch(reset());
    };
  }, [selectedDate, dispatch, isError, message]);

  const handleDeleteAppointment = (e, uuid) => {
    e.preventDefault();
    MySwal.fire({
      title: 'Ви впевнені?',
      text: 'Хочете видалити цей запис?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--piction-blue)',
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAppointment(uuid));
        toast.success('Запис видалено', {
          position: 'top-right',
          autoClose: 1200,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        const { day, month, year } = selectedDate;
        dispatch(getAppointments({ date: day, month, year }));
      }
    });
  };

  const handleUpdateAppointment = (e, uuid) => {
    e.preventDefault();
    dispatch(getAppointment(uuid));
    navigate(`/appointments/update/${uuid}`);
  };

  const handleSearchDate = (e) => {
    e.preventDefault();
    const selectedDate = document.getElementById('search-date').value;
    const [year, month, day] = selectedDate.split('-');
    setSelectedDate({ day, month, year });
    dispatch(getAppointments({ date: day, month, year }));
  };

  return (
    <>
      <div className="Appointments">
        <Navigator />
        <div className="appointments-content">
          <Header />
          <div className="appointments-body">
            <div className="appointments-main">
              <div className="top-block">
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
                    onClick={() => navigate('/appointments/create/')}
                  >
                    Додати запис
                  </button>
                </div>
              </div>
              <div className="table-block">
                <TableContainer component={Paper} className="table-container">
                  <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Пацієнт</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Лікар
                        </TableCell>

                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Час
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Кабінет
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Примітка
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Дії
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments &&
                        appointments.length > 0 &&
                        appointments.map((appointment) => (
                          <TableRow key={appointment.uuid}>
                            <TableCell
                              sx={{ cursor: 'pointer' }}
                              onClick={() =>
                                navigate(`/patients/get/${appointment.patient.uuid}`)
                              }
                            >
                              {appointment.patient.surname} {appointment.patient.name}{' '}
                              {appointment.patient.patronymic}
                            </TableCell>
                            <TableCell align="center">
                              {appointment.user.surname} {appointment.user.name}
                            </TableCell>
                            <TableCell align="center">
                              {appointment.startTime.slice(0, 5)} -{' '}
                              {appointment.endTime.slice(0, 5)}
                            </TableCell>
                            <TableCell align="center">{appointment.roomNumber}</TableCell>
                            <TableCell align="center">{appointment.note}</TableCell>
                            <TableCell align="center">
                              {appointment.receiptUuid !== null ? (
                                appointment.receipt.isPaid ? (
                                  <MdOutlinePayments
                                    color="green"
                                    cursor={'pointer'}
                                    className="icon"
                                    onClick={() => {
                                      dispatch(reset());
                                      navigate(
                                        `/appointments/receipt/${appointment.receiptUuid}`
                                      );
                                    }}
                                  />
                                ) : (
                                  <MdOutlinePayments
                                    color="red"
                                    cursor={'pointer'}
                                    className="icon"
                                    onClick={() => {
                                      dispatch(reset());
                                      navigate(
                                        `/appointments/receipt/${appointment.receiptUuid}`
                                      );
                                    }}
                                  />
                                )
                              ) : (
                                <MdOutlinePayments
                                  color="black"
                                  cursor={'pointer'}
                                  className="icon"
                                  onClick={() =>
                                    navigate(
                                      `/appointments/receipt/create/${appointment.uuid}`
                                    )
                                  }
                                />
                              )}
                              <FaEdit
                                cursor={'pointer'}
                                className="icon"
                                onClick={(e) =>
                                  handleUpdateAppointment(e, appointment.uuid)
                                }
                              />
                              <FaRegTrashAlt
                                cursor={'pointer'}
                                className="icon"
                                onClick={(e) =>
                                  handleDeleteAppointment(e, appointment.uuid)
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
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
