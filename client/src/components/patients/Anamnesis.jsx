import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getAllDiseases,
  reset,
  getAnamnesis,
  updateAnamnesis,
} from '../../features/patients/patientsSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import '../../css/Patients.css';
import Button from '../Button';

export default function Anamnesis({ uuid }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const patientUuid = uuid;
  const { diseases, anamnesis, isSuccess, isLoading, isError, message } = useSelector(
    (state) => state.patients
  );

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const [selectedDiseases, setSelectedDiseases] = useState({});
  const [notes, setNotes] = useState({});

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }

    dispatch(getAllDiseases());
    dispatch(getAnamnesis(patientUuid));

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  useEffect(() => {
    if (anamnesis && anamnesis.jsonAnamnesis) {
      try {
        const parsedAnamnesis = JSON.parse(anamnesis.jsonAnamnesis);
        const initialSelectedDiseases = {};
        const initialNotes = {};
        parsedAnamnesis.forEach((disease) => {
          initialSelectedDiseases[disease.diseaseUuid] = true;
          initialNotes[disease.diseaseUuid] = disease.note;
        });
        setSelectedDiseases(initialSelectedDiseases);
        setNotes(initialNotes);
      } catch {}
    }
  }, [anamnesis]);

  const handleCheckboxChange = (diseaseUuid) => {
    setSelectedDiseases((prev) => ({
      ...prev,
      [diseaseUuid]: !prev[diseaseUuid],
    }));
  };

  const handleNoteChange = (diseaseUuid, e) => {
    setNotes((prev) => ({
      ...prev,
      [diseaseUuid]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const data = Object.keys(selectedDiseases)
      .filter((diseaseUuid) => selectedDiseases[diseaseUuid])
      .map((diseaseUuid) => {
        const disease = diseases.find((d) => d.uuid === diseaseUuid);
        return {
          diseaseUuid,
          note: notes[diseaseUuid] || '',
        };
      });

    const updatedAnamnesis = {
      uuid: anamnesis.uuid,
      diseases: data,
    };
    dispatch(updateAnamnesis(updatedAnamnesis));
    alert('Анамнез оновлено');
    cancelEdit();
    dispatch(getAnamnesis(patientUuid));
  };

  const buttonEdit = document.getElementsByClassName('anamnesis-buttons');
  const buttonsSaveCancel = document.getElementsByClassName('anamnesis-buttons-2');

  const enableEdit = () => {
    document.querySelectorAll('.checkbox-disease').forEach((checkbox) => {
      checkbox.removeAttribute('disabled');
    });
    document.querySelectorAll('.textarea-note').forEach((note) => {
      note.removeAttribute('disabled');
    });
    buttonEdit[0].classList.add('disabled');
    buttonsSaveCancel[0].classList.remove('disabled');
  };

  const cancelEdit = () => {
    document.querySelectorAll('.checkbox-disease').forEach((checkbox) => {
      checkbox.setAttribute('disabled', '');
    });
    document.querySelectorAll('.textarea-note').forEach((note) => {
      note.setAttribute('disabled', '');
    });
    buttonEdit[0].classList.remove('disabled');
    buttonsSaveCancel[0].classList.add('disabled');
  };

  return (
    <>
      <div className="Anamnesis">
        <div className="anamnesis-table-container">
          <TableContainer
            className="table-container-diseases"
            component={Paper}
            sx={{ boxShadow: 'none', border: 'none' }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '55%' }}>
                    Назва хвороби
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Обрати
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Нотатки</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {diseases &&
                  diseases.length > 0 &&
                  diseases.map((disease) => (
                    <TableRow key={disease.uuid}>
                      <TableCell>{disease.name}</TableCell>
                      <TableCell align="center">
                        <input
                          disabled
                          type="checkbox"
                          className="anamnesis-inputs checkbox-disease"
                          checked={!!selectedDiseases[disease.uuid]}
                          onChange={() => handleCheckboxChange(disease.uuid)}
                        />
                      </TableCell>
                      <TableCell>
                        <textarea
                          disabled
                          type="text"
                          name="d-note"
                          className="anamnesis-inputs textarea-note"
                          placeholder="Нотаток"
                          value={notes[disease.uuid]}
                          onChange={(e) => handleNoteChange(disease.uuid, e)}
                        ></textarea>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="anamnesis-buttons">
          <Button
            type="button"
            text="Редагувати"
            color="var(--piction-blue)"
            onClick={enableEdit}
          />
        </div>
        <div className="anamnesis-buttons-2 disabled">
          <Button
            type="button"
            text="Зберегти"
            color="var(--piction-blue)"
            onClick={(e) => handleSave(e)}
          />
          <Button type="button" text="Скасувати" color="gray" onClick={cancelEdit} />
        </div>
      </div>
    </>
  );
}
