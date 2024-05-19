import React from 'react';
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

function createData(name, price) {
  return { name, price };
}

const rows = [
  createData('Консультація стоматолога-терапевта', 350),
  createData('Консультація стоматолога-ортопеда', 350),
  createData('Консультація стоматолога-хірурга', 350),
  createData('Консультація стоматолога-ортодонта', 350),
  createData('Лікування карієсу I-рівень', 1200),
  createData('Лікування карієсу II-рівень', 1450),
  createData('Лікування карієсу II-рівень', 1450),
  createData('Лікування карієсу II-рівень', 1450),
  createData('Лікування карієсу II-рівень', 1450),
  createData('Лікування карієсу II-рівень', 1450),
  createData('Лікування карієсу II-рівень', 1450),
  createData('Лікування карієсу II-рівень', 1450),
  createData('Лікування карієсу II-рівень', 1450),
];

export default function Services() {
  const navigate = useNavigate();

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
                  <input id="search-input" type="text" placeholder="Знайти послугу" />
                  <button className="service-buttons" type="button">
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
                      {rows.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="center">{row.price}</TableCell>
                          <TableCell align="center">
                            <FaEdit
                              className="icon"
                              onClick={() => navigate('/services/update/')}
                            />
                            <FaRegTrashAlt
                              className="icon"
                              onClick={() => navigate(`/services/delete/${row.id}`)}
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
