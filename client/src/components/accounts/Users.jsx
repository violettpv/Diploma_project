import React from 'react';
import { useEffect } from 'react';
import '../../css/Accounts.css';
import '../../index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
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
    if (!user) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message, {
        position: 'top-right',
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    if (!user || user.role !== 'main') {
      navigate('/');
      toast.warn('У вас немає доступу до цієї сторінки', {
        position: 'top-right',
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      dispatch(getUsers());
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
    if (window.confirm('Ви впевнені, що хочете видалити цього користувача?')) {
      dispatch(deleteUser(uuid));
    }
    // dispatch(reset());
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
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Дії
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users &&
                  users.length > 0 &&
                  users
                    .filter((oneUser) => oneUser.roles.length > 0)
                    .filter(
                      (oneUser) =>
                        oneUser.roles[0].role === 'doctor' ||
                        oneUser.roles[0].role === 'administrator'
                    )
                    .map((oneUser) => (
                      <TableRow key={oneUser.uuid}>
                        <TableCell>
                          {oneUser.surname} {oneUser.name} {oneUser.patronymic}
                        </TableCell>
                        <TableCell>{oneUser.phone}</TableCell>
                        <TableCell>{oneUser.email}</TableCell>
                        <TableCell>
                          {oneUser.roles[0].role
                            ? oneUser.roles[0].role === 'doctor'
                              ? 'Лікар'
                              : 'Адміністратор'
                            : '-'}
                        </TableCell>
                        <TableCell align="center">
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
