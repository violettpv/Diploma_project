import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Patients.css';
import '../../index.css';
import { toast } from 'react-toastify';
import { getAllPlansOfPatient, reset } from '../../features/patients/patientsSlice';
import Pagination from '@mui/material/Pagination';
import PlanCard from './PlanCard';

export default function TreatmentPlans({ uuid }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const patientUuid = params.uuid;
  const { treatmentPlans, isError, message } = useSelector((state) => state.patients);

  const [page, setPage] = useState(1);
  const plansPerPage = 9;

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
      dispatch(getAllPlansOfPatient(patientUuid));
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

  const currentPlans =
    treatmentPlans?.treatmentPlanRecords?.slice(
      (page - 1) * plansPerPage,
      page * plansPerPage
    ) || [];

  return (
    <>
      <div className="TreatmentPlans">
        <div className="treatmentplans-header">
          <div className="add-plan">
            <button onClick={() => navigate(`/patients/tplan/create/${uuid}`)}>
              Додати план
            </button>
          </div>
          <Pagination
            count={Math.ceil(
              (treatmentPlans?.treatmentPlanRecords?.length || 0) / plansPerPage
            )}
            page={page}
            onChange={handleChangePage}
            sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
          />
        </div>
        <div className="treatmentplans-list">
          {currentPlans.length > 0 ? (
            currentPlans.map((plan) => <PlanCard key={plan.uuid} plan={plan} />)
          ) : (
            <p>Плани не знайдені</p>
          )}
        </div>
      </div>
    </>
  );
}
