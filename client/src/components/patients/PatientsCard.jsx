import React, { useEffect } from 'react';
import '../../css/Patients.css';
import '../../index.css';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs } from '@mui/base/Tabs';
import { TabsList } from '@mui/base/TabsList';
import { TabPanel } from '@mui/base/TabPanel';
import { Tab } from '@mui/base/Tab';
import PatientsInfo from './PatientsInfo';
import Anamnesis from './Anamnesis';
import Form043 from './Form043';
import TreatmentPlans from './TreatmentPlans';
import DoctorsDiary from './DocsDiary/DoctorsDiary';
import DentalFormula from './DentalFormula/DentalFormula';
import PatientsAppointments from './PatientsAppointments';
import PPSettings from './PPageSettings';
import { useSelector } from 'react-redux';

export default function PatientsCard() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { uuid, tab } = useParams();

  const handleTabChange = (event, newValue) => {
    event.preventDefault();
    // navigate(`/patients/get/${uuid}/${newValue}`);
    navigate(`/patients/card/${uuid}/${newValue}`);
  };

  return (
    <>
      <div className="Patients">
        <Navigator />
        <div className="patients-content">
          <Header />
          <div className="patients-body">
            <Tabs
              className="patients-card-tabs"
              orientation="vertical"
              defaultValue="info"
              value={tab}
              // value={tab ? tab : 'info'}
              onChange={handleTabChange}
            >
              <TabsList className="tabs-list">
                <Tab className="tab" value="info">
                  Дані
                </Tab>
                <Tab className="tab" value="anamnesis">
                  Анамнез
                </Tab>
                <Tab className="tab" value="form043">
                  Форма 043/о
                </Tab>
                <Tab className="tab" value="treatmentPlans">
                  План лікування
                </Tab>
                <Tab className="tab" value="doctorsDiary">
                  Щоденник лікаря
                </Tab>
                <Tab className="tab" value="dentalFormula">
                  Зубна формула
                </Tab>
                <Tab className="tab" value="appointments">
                  Візити
                </Tab>
                <Tab className="tab" value="settings">
                  Кабінет
                </Tab>
              </TabsList>
              <hr className="custom-hr" />
              <div className="patients-card-main">
                <TabPanel value="info">
                  <PatientsInfo uuid={uuid} />
                </TabPanel>
                <TabPanel value="anamnesis">
                  <Anamnesis uuid={uuid} />
                </TabPanel>
                <TabPanel value="form043">
                  <Form043 uuid={uuid} />
                </TabPanel>
                <TabPanel value="treatmentPlans">
                  <TreatmentPlans uuid={uuid} />
                </TabPanel>
                <TabPanel value="doctorsDiary">
                  <DoctorsDiary uuid={uuid} />
                </TabPanel>
                <TabPanel value="dentalFormula">
                  <DentalFormula uuid={uuid} />
                </TabPanel>
                <TabPanel value="appointments">
                  <PatientsAppointments uuid={uuid} />
                </TabPanel>
                <TabPanel value="settings">
                  <PPSettings uuid={uuid} />
                </TabPanel>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
