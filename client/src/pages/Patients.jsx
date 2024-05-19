import React from 'react';
import '../css/Patients.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

  const [page, setPage] = useState(0);
  const rowsPerPage = 8;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
                  <input id="search-input" type="text" placeholder="Знайти пацієнта" />
                  <button className="service-buttons" type="button">
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
                          <TableCell>ПІБ пацієнта</TableCell>
                          <TableCell>Телефон</TableCell>
                          <TableCell>Вік</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/patients/get/`)}
                              >
                                {row.surname} {row.name} {row.patronymic}
                              </TableCell>
                              <TableCell>{row.phone}</TableCell>
                              <TableCell>{row.age}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
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

function createData(surname, name, patronymic, phone, age) {
  return { surname, name, patronymic, phone, age };
}
const rows = [
  createData('Іванов', 'Іван', 'Іванович', '+380123456789', 30),
  createData('Петров', 'Петро', 'Петрович', '+380123456789', 30),
  createData('Сидоров', 'Сидір', 'Сидорович', '+380123456789', 30),
  createData('Коваленко', 'Ковало', 'Коваленкович', '+380123456789', 30),
  createData('Ковальчук', 'Ковало', 'Ковальчукович', '+380123456789', 30),
  createData('Коваль', 'Ковало', 'Ковалович', '+380123456789', 30),
  createData('Ковалев', 'Ковало', 'Ковалевич', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальченко', 'Ковало', 'Ковальченкович', '+380123456789', 30),
  createData('Ковальчук', 'Ковало', 'Ковальчукович', '+380123456789', 30),
  createData('Коваль', 'Ковало', 'Ковалович', '+380123456789', 30),
  createData('Ковалев', 'Ковало', 'Ковалевич', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
  createData('Ковальський', 'Ковало', 'Ковальськович', '+380123456789', 30),
];
