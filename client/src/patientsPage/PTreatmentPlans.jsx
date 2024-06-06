import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NavigatorPatient from '../components/NavigatorPatient';
import '../css/PatientsPage.css';
import '../css/Patients.css';
import '../index.css';
import { toast } from 'react-toastify';
import { getAllTreatmentPlans, reset } from '../features/patientsPage/patientSlice';
import Pagination from '@mui/material/Pagination';
import PlanCard from '../components/patients/PlanCard';

export default function PTreatmentPlans() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { patient, treatmentPlans, isError, message } = useSelector(
    (state) => state.patient
  );

  useEffect(() => {
    if (!patient) {
      navigate('/loginpatient');
    }
  }, []);

  const [page, setPage] = useState(1);
  const plansPerPage = 9;

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

    dispatch(getAllTreatmentPlans(patient.uuid));
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch]);

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
      <div className="Main">
        <NavigatorPatient />
        <div className="main-content">
          <Header />
          <div className="main-body">
            <div className="treatmentplans-main">
              <div className="tplans-title">Ваші плани лікування</div>
              <hr className="custom-hr" />
              <div className="tplans-header">
                <Pagination
                  count={Math.ceil(
                    (treatmentPlans?.treatmentPlanRecords?.length || 0) / plansPerPage
                  )}
                  page={page}
                  onChange={handleChangePage}
                  sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
                />
              </div>
              <div className="tplans-list">
                {currentPlans.length > 0 ? (
                  currentPlans.map((plan) => <PlanCard key={plan.uuid} plan={plan} />)
                ) : (
                  <p>Плани не знайдені</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
