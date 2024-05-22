import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getAllDiseases,
  reset,
  createAnamnesis,
} from '../../features/patients/patientsSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Paper,
} from '@mui/material';
import '../../css/Patients.css';

export default function Anamnesis({ uuid }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { diseases, isSuccess, isLoading, isError, message } = useSelector(
    (state) => state.patients
  );
  const [selectedDiseases, setSelectedDiseases] = useState({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }

    dispatch(getAllDiseases());

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  const handleCheckboxChange = (diseaseUuid) => {
    setSelectedDiseases((prev) => ({
      ...prev,
      [diseaseUuid]: !prev[diseaseUuid],
    }));
  };

  const handleNoteChange = (diseaseUuid, note) => {
    setNotes((prev) => ({
      ...prev,
      [diseaseUuid]: note,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patientUuid = uuid; // Patient's UUID from URL
    const data = Object.keys(selectedDiseases)
      .filter((diseaseUuid) => selectedDiseases[diseaseUuid])
      .map((diseaseUuid) => ({
        patientUuid,
        diseaseUuid,
        note: notes[diseaseUuid] || '',
      }));

    dispatch(createAnamnesis(data));
  };

  return (
    <>
      <div className="Anamnesis">
        <TableContainer
          className="table-container-diseases"
          component={Paper}
          sx={{ boxShadow: 'none', border: 'none' }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Назва хвороби</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Обрати</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Нотатки</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diseases ? (
                diseases.map((disease) => (
                  <TableRow key={disease.uuid}>
                    <TableCell>{disease.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={!!selectedDiseases[disease.uuid]}
                        onChange={() => handleCheckboxChange(disease.uuid)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={notes[disease.uuid] || ''}
                        onChange={(e) => handleNoteChange(disease.uuid, e.target.value)}
                        placeholder="Нотатка"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="diseases-buttons">
          <button id="diseases-button-update" type="button" onClick={handleSubmit}>
            Редагувати
          </button>
          <button
            className="disabled"
            id="diseases-button-save"
            type="button"
            onClick={handleSubmit}
          >
            Зберегти
          </button>
          <button
            className="disabled"
            id="diseases-button-cancel"
            type="button"
            onClick={handleSubmit}
          >
            Скасувати
          </button>
        </div>
      </div>
    </>
  );
}
