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
import DoctorsDiary from './DoctorsDiary';
import DentalFormula from './DentalFormula';
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

  const { uuid } = useParams();

  return (
    <>
      <div className="Patients">
        <Navigator />
        <div className="patients-content">
          <Header />
          <div className="patients-body">
            <Tabs className="patients-card-tabs" defaultValue={0} orientation="vertical">
              <TabsList className="tabs-list">
                <Tab className="tab">Дані</Tab>
                <Tab className="tab">Анамнез</Tab>
                <Tab className="tab">Форма 043/о</Tab>
                <Tab className="tab">План лікування</Tab>
                <Tab className="tab">Щоденник лікаря</Tab>
                <Tab className="tab">Зубна формула</Tab>
                <Tab className="tab">Візити</Tab>
                <Tab className="tab">Кабінет</Tab>
              </TabsList>
              <hr className="custom-hr" />
              <div className="patients-card-main">
                <TabPanel value={0}>
                  <PatientsInfo uuid={uuid} />
                </TabPanel>
                <TabPanel value={1}>
                  <Anamnesis uuid={uuid} />
                </TabPanel>
                <TabPanel value={2}>
                  <Form043 uuid={uuid} />
                </TabPanel>
                <TabPanel value={3}>
                  <TreatmentPlans uuid={uuid} />
                </TabPanel>
                <TabPanel value={4}>
                  <DoctorsDiary uuid={uuid} />
                </TabPanel>
                <TabPanel value={5}>
                  <DentalFormula uuid={uuid} />
                </TabPanel>
                <TabPanel value={6}>
                  <PatientsAppointments uuid={uuid} />
                </TabPanel>
                <TabPanel value={7}>
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
