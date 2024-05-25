import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/Patients.css';
import '../../index.css';
import {
  getPatient,
  getAllPatientsAppointments,
  reset,
} from '../../features/patients/patientsSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

export default function PatientsAppointments({ uuid }) {
  const dispatch = useDispatch();
  const patientUuid = uuid;
  const { patient, appointments, isError, message } = useSelector(
    (state) => state.patients
  );

  useEffect(() => {
    // check user's role
    // if (user) {
    //   dispatch(getMe());
    //   let role = user.role;
    //   if (!(role === 'doctor' || role === 'main')) {
    //     alert('Доступ заборонено');
    //     // navigate('/');
    //   }
    // }

    if (isError) {
      console.error('Error:', message);
    }

    dispatch(getPatient(patientUuid));
    dispatch(getAllPatientsAppointments(patientUuid));

    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, uuid]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="PatientsAppointments">
        <div className="patients-appointments-header">
          <b>
            Візити пацієнта: {patient.surname} {patient.name} {patient.patronymic}
          </b>
        </div>
        <div className="custom-hr"></div>
        <div className="patients-appointments-main">
          <TableContainer
            className="patients-appointments-table"
            component={Paper}
            sx={{ boxShadow: 'none', border: 'none' }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Дата</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Час</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Сума</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>
                    Тип оплати
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>
                    Процедури
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments &&
                  appointments.length > 0 &&
                  appointments.map((appointment) => (
                    <TableRow key={appointment.uuid}>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>
                        {appointment.startTime.slice(0, 5)} -{' '}
                        {appointment.endTime.slice(0, 5)}
                      </TableCell>
                      <TableCell>
                        {appointment && appointment.receipt && appointment.receipt.total
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
        </div>
      </div>
    </>
  );
}