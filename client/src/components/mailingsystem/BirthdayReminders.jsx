import React, { useEffect, useState } from 'react';
import '../../css/MailingSystem.css';
import '../../index.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBirthdays,
  getAllTemplates,
  reset,
  sendMessage,
} from '../../features/mailingsystem/msysSlice';

export default function BirthdayReminders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { birthdays, templates, isError, message } = useSelector(
    (state) => state.msystem
  );

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const [selectedBirthdays, setSelectedBirthdays] = useState([]);
  const [subject, setSubject] = useState('');
  const [template, setTemplate] = useState(null);

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

    dispatch(getBirthdays());
    dispatch(getAllTemplates());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  const handleBirthdaysSelection = (birthday) => {
    setSelectedBirthdays((prevSelected) => {
      if (prevSelected.includes(birthday)) {
        return prevSelected.filter((item) => item !== birthday);
      } else {
        return [...prevSelected, birthday];
      }
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (selectedBirthdays.length === 0) {
      toast.error('Виберіть принаймні одного пацієнта.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    if (!subject) {
      toast.error('Введіть тему листа.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    if (!template) {
      toast.error('Оберіть шаблон.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    const selectedPatients = selectedBirthdays.map((birthday) => birthday.uuid);
    dispatch(
      sendMessage({
        patients: selectedPatients,
        subject: subject,
        templateUuid: template.uuid,
      })
    );
    toast.success('Нагадування відправлено', {
      position: 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    setSelectedBirthdays([]);
    setSubject('');
    setTemplate(null);
  };

  return (
    <>
      <div className="MSysInfo">
        <div className="msys-info-main">
          <div className="template-header">
            <div className="subject">
              <input
                placeholder="Тема листа"
                type="text"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="choose-template">
              <select
                name="template"
                value={template ? template.uuid : ''}
                onChange={(e) =>
                  setTemplate(templates.find((t) => t.uuid === e.target.value) || null)
                }
              >
                <option value="">Оберіть шаблон</option>
                {templates
                  .filter((t) => t.uuid !== '6d5c51a9-49c6-4510-8de3-afa55dc8ee8f')
                  .map((t) => (
                    <option key={t.uuid} value={t.uuid}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="send-greetings">
              <button type="button" onClick={(e) => handleSendMessage(e)}>
                Відправити
              </button>
            </div>
          </div>
          <div className="bdays-table-block">
            <TableContainer className="bdays-table-container">
              <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: '8%' }}>
                      Обрати
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '23%' }}>
                      Пацієнт
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '23%' }}>Пошта</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: '23%' }}>
                      Дата народження
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {birthdays &&
                    birthdays.patients &&
                    birthdays.patients.length > 0 &&
                    birthdays.patients.map((birthday) => (
                      <TableRow key={birthday.uuid}>
                        <TableCell align="center">
                          <Checkbox
                            checked={selectedBirthdays.includes(birthday)}
                            onChange={() => handleBirthdaysSelection(birthday)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/patients/get/${birthday.uuid}`)}
                        >
                          {birthday.surname} {birthday.name} {birthday.patronymic}
                        </TableCell>
                        <TableCell>
                          {birthday.email ? birthday.email : 'Відсутня'}
                        </TableCell>
                        <TableCell align="center">{birthday.birthdate}</TableCell>
                      </TableRow>
                    ))} */}
                  {birthdays && birthdays.patients && birthdays.patients.length > 0 ? (
                    birthdays.patients.map((birthday) => (
                      <TableRow key={birthday.uuid}>
                        <TableCell align="center">
                          <Checkbox
                            checked={selectedBirthdays.includes(birthday)}
                            onChange={() => handleBirthdaysSelection(birthday)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/patients/get/${birthday.uuid}`)}
                        >
                          {birthday.surname} {birthday.name} {birthday.patronymic}
                        </TableCell>
                        <TableCell>
                          {birthday.email ? birthday.email : 'Відсутня'}
                        </TableCell>
                        <TableCell align="center">{birthday.birthdate}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        Сьогодні немає іменинників.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
