import React from 'react';
import Header from '../components/Header';
import NavigatorPatient from '../components/NavigatorPatient';
import '../css/PatientsPage.css';
import '../index.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getMePatient,
  getAppointments,
  reset,
} from '../features/patientsPage/patientSlice';
import { resetPage, savePage } from '../features/other/otherSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';

export default function PAppointments() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patient, appointments, isError, message } = useSelector(
    (state) => state.patient
  );

  const { page } = useSelector((state) => state.other);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (patient && patient.token) {
      dispatch(getMePatient());
      dispatch(getAppointments(patient.token));
    } else {
      navigate('/loginpatient');
    }

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  if (!patient) {
    <div>Loading...</div>;
  }

  const rowsPerPage = 7;
  const handleChangePage = (event, newPage) => {
    dispatch(savePage(newPage));
  };

  return (
    <>
      <div className="PAppointments">
        <NavigatorPatient />
        <div className="main-content">
          <Header />
          <div className="main-body">
            <div className="pa-page-main">
              <div className="pa-page-header">
                <b>Ваші візити до стоматолога</b>
              </div>
              <div className="custom-hr"></div>
              <div className="pa-table-div">
                <TableContainer
                  className="pa-page-table"
                  sx={{
                    boxShadow: 'none',
                    border: 'none',
                    width: '100%',
                    height: '87%',
                  }}
                >
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Дата</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Час</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Сума</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Тип оплати</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>
                          Процедури
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments &&
                        appointments.length > 0 &&
                        appointments
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((appointment) => (
                            <TableRow key={appointment.uuid}>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>
                                {appointment.startTime.slice(0, 5)} -{' '}
                                {appointment.endTime.slice(0, 5)}
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
                                {appointment &&
                                appointment.receipt &&
                                appointment.receipt.services
                                  ? appointment.receipt.services.map((service) => (
                                      <ul>
                                        <li>{service.name}</li>
                                      </ul>
                                    ))
                                  : 'Відсутні'}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={appointments.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} з ${count}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
