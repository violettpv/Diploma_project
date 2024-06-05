import React, { useEffect, useState } from 'react';
import '../css/Dispensary.css';
import '../index.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import { useNavigate } from 'react-router-dom';
import { LuCalendarSearch } from 'react-icons/lu';
import { MdPersonSearch } from 'react-icons/md';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaRegTrashAlt, FaEdit } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, reset as resetUsers } from '../features/user/userSlice';
import {
  reset,
  getAllDispensary,
  findRecordsByDate,
  findRecordsOfDoctor,
  findRecordsOfPatient,
  deleteDispensary,
} from '../features/dispensary/dispensarySlice';
import { savePage } from '../features/other/otherSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

  const { dispensary, isError, message } = useSelector((state) => state.dispensary);
  const {
    users,
    isError: isErrorUser,
    message: messageUser,
  } = useSelector((state) => state.user);

  const { page } = useSelector((state) => state.other);
  const [searchByPatient, setSearchByPatient] = useState('');
  const [searchByDoctor, setSearchByDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

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
    if (isErrorUser) {
      toast.error(messageUser, {
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
    dispatch(getAllDispensary());

    return () => {
      dispatch(reset());
      dispatch(resetUsers());
    };
  }, [dispatch, isError, message]);

  if (!dispensary) {
    return <div>Loading...</div>;
  }

  const rowsPerPage = 8;
  const handleChangePage = (event, newPage) => {
    dispatch(savePage(newPage));
  };

  const handleSearchByPatient = (e) => {
    e.preventDefault();
    dispatch(findRecordsOfPatient(searchByPatient));
  };

  const handleSearchByDoctor = (e) => {
    e.preventDefault();
    dispatch(findRecordsOfDoctor(searchByDoctor));
  };

  const handleSearchDate = (e) => {
    e.preventDefault();
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-');
      dispatch(findRecordsByDate({ date: day, month, year }));
    } else {
      dispatch(getAllDispensary());
    }
  };

  const handleUpdateRecord = (uuid) => {
    navigate(`/dispensary/update/${uuid}`);
  };

  const handeDeleteRecord = (uuid) => {
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
        dispatch(deleteDispensary(uuid));
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
        dispatch(getAllDispensary());
      }
    });
  };

  return (
    <>
      <div className="Dispensary">
        <Navigator />
        <div className="dispensary-content">
          <Header />
          <div className="dispensary-body">
            <div className="dispensary-main">
              <div className="dispensary-header">
                <div id="dispensary-title">Диспансерний облік</div>
                <div className="search-by-date">
                  <input
                    type="date"
                    name="date"
                    id="search-date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <button
                    className="dispensary-buttons"
                    type="button"
                    onClick={(e) => handleSearchDate(e)}
                  >
                    <LuCalendarSearch />
                  </button>
                </div>
                <div className="search-by-patient">
                  <input
                    id="search-patient"
                    type="text"
                    placeholder="Пошук за пацієнтом"
                    onChange={(e) => setSearchByPatient(e.target.value)}
                  />
                  <button
                    className="dispensary-buttons"
                    type="button"
                    onClick={(e) => handleSearchByPatient(e)}
                  >
                    <MdPersonSearch />
                  </button>
                </div>
                <div className="search-by-doctor">
                  <select
                    id="search-doctor"
                    value={searchByDoctor}
                    onChange={(e) => setSearchByDoctor(e.target.value)}
                  >
                    <option value="_">Виберіть лікаря</option>
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
                  <button
                    className="dispensary-buttons"
                    type="button"
                    onClick={(e) => handleSearchByDoctor(e)}
                  >
                    <FaUserDoctor />
                  </button>
                </div>
                <div className="add-dispensary">
                  <button
                    id="add-dispensary-button"
                    type="button"
                    onClick={() => navigate('/dispensary/create/')}
                  >
                    Додати запис
                  </button>
                </div>
              </div>
              <div className="table-block">
                <Paper>
                  <TableContainer sx={{ height: '68vh' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>
                            Пацієнт
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', width: '18%' }}>
                            Лікар
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>
                            Дата
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', width: '7%' }}>
                            Час
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Процедура</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Нотаток</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                            Дії
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dispensary &&
                          dispensary.length > 0 &&
                          dispensary
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((record) => (
                              <TableRow key={record.uuid}>
                                <TableCell
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() =>
                                    navigate(`/patients/get/${record.patient.uuid}`)
                                  }
                                >
                                  {record.patient.surname} {record.patient.name}{' '}
                                  {record.patient.patronymic}
                                </TableCell>
                                <TableCell>
                                  {record.user.surname} {record.user.name}
                                </TableCell>
                                <TableCell>{record.dateOfTheVisit}</TableCell>
                                <TableCell>{record.timeNeeded}</TableCell>
                                <TableCell>{record.treatment}</TableCell>
                                <TableCell>{record.notes}</TableCell>
                                <TableCell align="center">
                                  <FaEdit
                                    cursor={'pointer'}
                                    className="record-icon"
                                    onClick={() => handleUpdateRecord(record.uuid)}
                                  />
                                  <FaRegTrashAlt
                                    cursor={'pointer'}
                                    className="record-icon"
                                    onClick={() => handeDeleteRecord(record.uuid)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={dispensary.length}
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
