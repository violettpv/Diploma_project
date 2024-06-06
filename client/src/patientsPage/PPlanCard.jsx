import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Patients.css';
import '../index.css';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Navigator from '../components/NavigatorPatient';
import {
  getTreatmentPlan,
  reset,
  resetPlans,
} from '../features/patientsPage/patientSlice';

export default function PPlanCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uuid } = useParams();

  const { patient, plan, isError, message } = useSelector((state) => state.patient);

  useEffect(() => {
    if (!patient) {
      navigate('/loginpatient');
    }
  }, []);

  const treatmentPlanFormRef = useRef(null);

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

    if (uuid) {
      dispatch(getTreatmentPlan(uuid));
    }

    return () => {
      dispatch(reset());
      dispatch(resetPlans());
    };
  }, [isError, message, dispatch, uuid]);

  return (
    <>
      <div className="TreatmentPlan">
        <Navigator />
        <div className="tplan-content">
          <Header />
          <div className="tplan-body">
            <div className="tplan-main">
              <div className="tplan-fullname">
                <div className="tplan-title">План лікування</div>
                <hr className="custom-hr" />
              </div>
              <form id="tplan-form" name="tplan-form" ref={treatmentPlanFormRef}>
                <div className="tplan-data-row">
                  <label htmlFor="date">Дата:</label>
                  <input
                    readOnly
                    className="tplan-inputs"
                    name="date"
                    type="date"
                    defaultValue={plan.date}
                  />
                </div>
                <div className="tplan-data-row">
                  <label htmlFor="examination">План обстеження:</label>
                  <textarea
                    readOnly
                    className="tplan-inputs"
                    name="examination"
                    type="text"
                    defaultValue={plan.examination}
                  />
                </div>
                <div className="tplan-data-row">
                  <label htmlFor="treatment">План лікування:</label>
                  <textarea
                    readOnly
                    className="tplan-inputs"
                    name="treatment"
                    type="text"
                    defaultValue={plan.treatment}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
