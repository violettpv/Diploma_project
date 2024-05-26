import React from 'react';
import { useEffect } from 'react';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import '../../css/Accounts.css';
import '../../index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt, FaEdit } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { getUsers, deleteUser, reset } from '../../features/user/userSlice';

export default function Users() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, users, isError, isSuccess, message } = useSelector((state) => state.user);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user || user.role !== 'main') {
      navigate('/');
      alert('У вас немає доступу до цієї сторінки');
    } else {
      dispatch(getUsers(user.token));
    }

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  if (!user || !users) {
    <div>Loading...</div>;
  }

  const handleDeleteUser = async (e, uuid) => {
    e.preventDefault();
    dispatch(deleteUser(uuid));
    dispatch(reset());
    dispatch(getUsers());
  };

  return (
    <>
      <div className="Users">
        <div className="table-block">
          <TableContainer className="table-container">
            <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Працівник</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Телефон</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Пошта</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Роль</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users &&
                  users.length > 0 &&
                  users.map((oneUser) => (
                    <TableRow key={oneUser.uuid}>
                      <TableCell>
                        {oneUser.surname} {oneUser.name} {oneUser.patronymic}
                      </TableCell>
                      <TableCell>{oneUser.phone}</TableCell>
                      <TableCell>{oneUser.email}</TableCell>
                      <TableCell>
                        {oneUser.role
                          ? oneUser.role === 'doctor'
                            ? 'Лікар'
                            : 'Адміністратор'
                          : '-'}
                      </TableCell>
                      <TableCell align="center">
                        {/* <FaEdit
                          cursor={'pointer'}
                          className="icon"
                          onClick={(e) => handleUpdateAppointment(e, appointment.uuid)}
                        /> */}
                        <FaRegTrashAlt
                          cursor={'pointer'}
                          className="icon"
                          onClick={(e) => handleDeleteUser(e, oneUser.uuid)}
                        />
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
