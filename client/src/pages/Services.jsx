import React, { useEffect, useState } from 'react';
import '../css/Services.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt, FaEdit } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  getServices,
  getService,
  searchServices,
  reset,
  deleteService,
} from '../features/services/serviceSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Services() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services, isError, message } = useSelector((state) => state.services);
  const [search, setSearch] = useState('');

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }

    dispatch(getServices());

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  if (!services) {
    return <div>Loading...</div>;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchServices(search));
  };
  const handeDeleteService = (uuid) => {
    if (!user || user.role !== 'main') {
      alert('У вас немає доступу до видалення послуги');
      return;
    }
    if (window.confirm('Ви впевнені, що хочете видалити цю послугу?')) {
      dispatch(deleteService(uuid));
      alert('Послугу видалено');
      dispatch(getServices());
      navigate('/services');
    }
  };

  const handleUpdateService = (uuid) => {
    dispatch(getService(uuid));
    navigate(`/services/update/${uuid}`);
  };

  return (
    <>
      <div className="Services">
        <Navigator />
        <div className="services-content">
          <Header />
          <div className="services-body">
            <div className="services-main">
              <div className="top-block">
                <div className="search-service">
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Знайти послугу"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    id="search-services-button"
                    className="service-buttons"
                    type="button"
                    onClick={(e) => handleSearch(e)}
                  >
                    Пошук
                  </button>
                </div>
                <div className="add-service">
                  <button
                    className="service-buttons"
                    type="button"
                    onClick={() => navigate('/services/create/')}
                  >
                    Додати послугу
                  </button>
                </div>
              </div>
              <div className="table-block">
                <TableContainer component={Paper} className="table-container">
                  <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Назва послуги</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Ціна
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Дії
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.uuid}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell align="center">{service.price}</TableCell>
                          <TableCell align="center">
                            <FaEdit
                              cursor={'pointer'}
                              className="icon"
                              onClick={() => handleUpdateService(service.uuid)}
                            />
                            <FaRegTrashAlt
                              cursor={'pointer'}
                              className="icon"
                              onClick={() => handeDeleteService(service.uuid)}
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
