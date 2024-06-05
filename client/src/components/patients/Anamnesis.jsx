import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  const { diseases, anamnesis, isSuccess, isError, message } = useSelector(
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

  const buttonEditRef = useRef(null);
  const buttonsSaveCancelRef = useRef(null);

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
      } catch (error) {
        toast.error(error, {
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
    }
  }, [anamnesis]);

  if (!diseases) {
    return <div>Loading...</div>;
  }

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
        diseases.find((d) => d.uuid === diseaseUuid);
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
    toast.success('Анамнез оновлено', {
      position: 'top-right',
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    cancelEdit();
    dispatch(getAnamnesis(patientUuid));
  };

  const enableEdit = () => {
    document.querySelectorAll('.checkbox-disease').forEach((checkbox) => {
      checkbox.removeAttribute('disabled');
    });
    document.querySelectorAll('.textarea-note').forEach((note) => {
      note.removeAttribute('disabled');
    });
    buttonEditRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
  };

  const cancelEdit = () => {
    document.querySelectorAll('.checkbox-disease').forEach((checkbox) => {
      checkbox.setAttribute('disabled', '');
    });
    document.querySelectorAll('.textarea-note').forEach((note) => {
      note.setAttribute('disabled', '');
    });
    buttonEditRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
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
        <div className="anamnesis-buttons" ref={buttonEditRef}>
          <Button
            type="button"
            text="Редагувати"
            color="var(--piction-blue)"
            onClick={enableEdit}
          />
        </div>
        <div className="anamnesis-buttons-2 disabled" ref={buttonsSaveCancelRef}>
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
