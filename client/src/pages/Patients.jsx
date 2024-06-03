import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../css/Patients.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import { useNavigate } from 'react-router-dom';
import { getPatients, findPatient, reset } from '../features/patients/patientsSlice';
import { resetPage, savePage } from '../features/other/otherSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';

export default function Patients() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { patients, isError, message } = useSelector((state) => state.patients);
  const { page } = useSelector((state) => state.other);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }

    dispatch(getPatients());

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  const rowsPerPage = 8;
  const handleChangePage = (event, newPage) => {
    dispatch(savePage(newPage));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(findPatient(search));
  };

  const getAge = (birthdate) => {
    let today = new Date();
    let birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDifference = today.getMonth() - birthDate.getMonth();
    // Якщо місяць народження ще не настав у поточному році,
    // або настав, але день народження ще не настав
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }
    return age;
  };

  return (
    <>
      <div className="Patients">
        <Navigator />
        <div className="patients-content">
          <Header />
          <div className="patients-body">
            <div className="patients-main">
              <div className="top-block">
                <div className="search-service">
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Знайти пацієнта"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    className="service-buttons"
                    type="button"
                    id="search-patient-button"
                    onClick={(e) => handleSearch(e)}
                  >
                    Пошук
                  </button>
                </div>
                <div className="add-service">
                  <button
                    className="service-buttons"
                    type="button"
                    onClick={() => navigate('/patients/create/')}
                  >
                    Додати пацієнта
                  </button>
                </div>
              </div>
              <div className="table-block">
                <Paper>
                  <TableContainer sx={{ height: '68vh' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>ПІБ пацієнта</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Телефон</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Вік</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {patients
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((patient) => (
                            <TableRow key={patient.uuid}>
                              <TableCell
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/patients/get/${patient.uuid}`)}
                              >
                                {patient.surname} {patient.name} {patient.patronymic}
                              </TableCell>
                              <TableCell>{patient.phone}</TableCell>
                              <TableCell>
                                {patient.birthdate ? getAge(patient.birthdate) : '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={patients.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} з ${count}`
                    }
                  />
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
