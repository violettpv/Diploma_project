import React, { useEffect } from 'react';
import '../css/MailingSystem.css';
import '../index.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tabs } from '@mui/base/Tabs';
import { TabsList } from '@mui/base/TabsList';
import { TabPanel } from '@mui/base/TabPanel';
import { Tab } from '@mui/base/Tab';
import MSysInfo from '../components/mailingsystem/MSysInfo';
import AppointmentReminders from '../components/mailingsystem/AppointmentReminders';
import CustomReminders from '../components/mailingsystem/CustomReminders';
import Templates from '../components/mailingsystem/Templates';
// pages

export default function MailingSystem() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      <div className="MailingSystem">
        <Navigator />
        <div className="msys-content">
          <Header />
          <div className="msys-body">
            <Tabs className="msys-card-tabs" defaultValue={0} orientation="vertical">
              <TabsList className="msys-tabs-list">
                <Tab className="tab">Загальна інформація</Tab>
                <Tab className="tab">Нагадування про візит</Tab>
                <Tab className="tab">Відправити за повідомлення</Tab>
                <Tab className="tab">Шаблони</Tab>
              </TabsList>
              <hr className="custom-hr" />
              <div className="msys-card-main">
                <TabPanel value={0}>
                  <MSysInfo />
                </TabPanel>
                <TabPanel value={1}>
                  <AppointmentReminders />
                </TabPanel>
                <TabPanel value={2}>
                  <CustomReminders />
                </TabPanel>
                <TabPanel value={3}>
                  <Templates />
                </TabPanel>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
