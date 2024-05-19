import React from 'react';
import '../../css/Patients.css';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
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

const testData = {
  surname: 'Коваль',
  name: 'Петро',
  patronymic: 'Петрович',
  phone: '+380123456789',
  email: 'test@gmail.com',
  birthdate: '01.01.1990',
  address: 'вул. Тестова 1',
  notes: 'Примітки',
};

export default function PatientsCard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="Patients">
        <Navigator />
        <div className="patients-content">
          <Header />
          <div className="patients-body">
            <div className="patients-card-main">
              <div className="patients-fullname">{`${testData.surname} ${testData.name} ${testData.patronymic}`}</div>
              <hr />
              <form className="patients-data">
                <div className="patients-data-row">
                  <label>
                    <span>Прізвище:</span>
                    <input
                      type="text"
                      disabled
                      className="card-inputs"
                      value={testData.surname}
                    />
                  </label>
                  <label>
                    <span>Ім'я:</span>
                    <input
                      type="text"
                      disabled
                      className="card-inputs"
                      value={testData.name}
                    />
                  </label>
                  <label>
                    <span>По батькові:</span>
                    <input
                      type="text"
                      disabled
                      className="card-inputs"
                      value={testData.patronymic}
                    />
                  </label>
                  <label>
                    <span>Телефон:</span>
                    <input
                      type="text"
                      disabled
                      className="card-inputs"
                      value={testData.phone}
                    />
                  </label>
                </div>
                <div className="patients-data-row">
                  <label>
                    <span>Email:</span>
                    <input
                      type="text"
                      disabled
                      className="card-inputs"
                      value={testData.email}
                    />
                  </label>
                  <label>
                    <span>Дата народження:</span>
                    <input
                      type="text"
                      disabled
                      className="card-inputs"
                      value={testData.birthdate}
                    />
                  </label>
                  <label>
                    <span>Адреса:</span>
                    <input
                      type="text"
                      disabled
                      className="card-inputs"
                      value={testData.address}
                    />
                  </label>
                  <label>
                    <span>Примітки:</span>
                    <textarea disabled className="card-inputs" value={testData.notes} />
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
