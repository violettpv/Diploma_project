import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/Patients.css';
import '../../../index.css';
import { toast } from 'react-toastify';
import {
  getAllDocsDiaryRecordsOfPatient,
  reset,
} from '../../../features/patients/patientsSlice';
import Pagination from '@mui/material/Pagination';
import DDRecordCard from './DDRecordCard';

export default function DoctorsDiary({ uuid }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const patientUuid = params.uuid;
  const { docsDiaryRecords, isError, message } = useSelector((state) => state.patients);

  const [page, setPage] = useState(1);
  const recordsPerPage = 3;

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

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

    if (user && (user.role === 'doctor' || user.role === 'main')) {
      dispatch(getAllDocsDiaryRecordsOfPatient(patientUuid));
    } else {
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
      navigate(`/patients/card/${patientUuid}/info`);
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, patientUuid]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const currentRecords =
    docsDiaryRecords?.doctorsDiaryRecords?.slice(
      (page - 1) * recordsPerPage,
      page * recordsPerPage
    ) || [];

  return (
    <>
      <div className="TreatmentPlans">
        <div className="treatmentplans-header">
          <div className="add-plan">
            <button onClick={() => navigate(`/patients/docsdiary/create/${uuid}`)}>
              Додати запис
            </button>
          </div>
          <Pagination
            count={Math.ceil(
              (docsDiaryRecords?.doctorsDiaryRecords?.length || 0) / recordsPerPage
            )}
            page={page}
            onChange={handleChangePage}
            sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
          />
        </div>
        <div className="docsrecords-list">
          {currentRecords.length > 0 ? (
            currentRecords.map((record) => (
              <DDRecordCard key={record.uuid} record={record} />
            ))
          ) : (
            <p>Записи не знайдені</p>
          )}
        </div>
      </div>
    </>
  );
}
