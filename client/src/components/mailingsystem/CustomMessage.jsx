import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/MailingSystem.css';
import '../../index.css';
import { toast } from 'react-toastify';
import {
  createMessage,
  getAllTemplates,
  sendMessage,
  reset,
} from '../../features/mailingsystem/msysSlice';
import {
  getPatients,
  reset as resetPatients,
} from '../../features/patients/patientsSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';

export default function CustomMessage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { templates, isError, message } = useSelector((state) => state.msystem);
  const { patients } = useSelector((state) => state.patients);

  const [selectedPatients, setSelectedPatients] = useState([]);
  const [subject, setSubject] = useState('');
  const [template, setTemplate] = useState(null);
  const [useTemplate, setUseTemplate] = useState(true);
  const [messageBody, setMessageBody] = useState('');

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

    dispatch(getAllTemplates());
    dispatch(getPatients());

    return () => {
      dispatch(reset());
      dispatch(resetPatients());
    };
  }, [dispatch, isError, message, navigate]);

  const handlePatientsSelection = (patient) => {
    setSelectedPatients((prevSelected) => {
      if (prevSelected.includes(patient)) {
        return prevSelected.filter((item) => item !== patient);
      } else {
        return [...prevSelected, patient];
      }
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (selectedPatients.length === 0) {
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
    if (useTemplate && !template) {
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
    if (!useTemplate && !messageBody) {
      toast.error('Введіть текст повідомлення.', {
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

    const selectedPatientsUuids = selectedPatients.map((patient) => patient.uuid);

    if (useTemplate) {
      dispatch(
        sendMessage({
          patients: selectedPatientsUuids,
          subject: subject,
          templateUuid: template.uuid,
        })
      );
    } else {
      dispatch(
        createMessage({
          patients: selectedPatientsUuids,
          subject: subject,
          body: messageBody,
        })
      );
    }

    toast.success('Повідомлення відправлено', {
      position: 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

    setSelectedPatients([]);
    setSubject('');
    setTemplate(null);
    setMessageBody('');
  };

  return (
    <>
      <div className="CustomMessage">
        <div className="custom-message-content">
          <div className="message-header">
            <div className="message-header-row">
              <div className="use-template">
                <label>
                  <input
                    type="checkbox"
                    checked={useTemplate}
                    onChange={() => setUseTemplate(!useTemplate)}
                  />
                  <span>Використати шаблон</span>
                </label>
              </div>
              {useTemplate ? (
                <div className="choose-template">
                  <select
                    name="template"
                    value={template ? template.uuid : ''}
                    onChange={(e) =>
                      setTemplate(
                        templates.find((t) => t.uuid === e.target.value) || null
                      )
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
              ) : (
                <div className="message-body">
                  <textarea
                    placeholder="Текст повідомлення"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="message-header-row">
              <div className="subject">
                <input
                  placeholder="Тема листа"
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="send-message">
                <button type="button" onClick={handleSendMessage}>
                  Відправити
                </button>
              </div>
            </div>
          </div>
          <div className="patients-table-block">
            <TableContainer className="patients-table-container">
              <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: '8%' }}>
                      Обрати
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>
                      Пацієнт
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '28.5%' }}>
                      Пошта
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: '28.5%' }}>
                      Телефон
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.length > 0 &&
                    patients.map((patient) => (
                      <TableRow key={patient.uuid}>
                        <TableCell align="center">
                          <Checkbox
                            checked={selectedPatients.includes(patient)}
                            onChange={() => handlePatientsSelection(patient)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/patients/get/${patient.uuid}`)}
                        >
                          {patient.surname} {patient.name} {patient.patronymic}
                        </TableCell>
                        <TableCell>
                          {patient.email ? patient.email : 'Відсутня'}
                        </TableCell>
                        <TableCell align="center">{patient.phone}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
