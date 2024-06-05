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
import CustomMessage from '../components/mailingsystem/CustomMessage';
import Templates from '../components/mailingsystem/Templates';
import CreateTemplate from '../components/mailingsystem/CreateTemplate';
import BirthdayReminders from '../components/mailingsystem/BirthdayReminders';

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
                <Tab className="tab">Інформація</Tab>
                <Tab className="tab">Нагадування про візит</Tab>
                <Tab className="tab">Відправити повідомлення</Tab>
                <Tab className="tab">Привітання з ДН</Tab>
                <Tab className="tab">Шаблони</Tab>
                <Tab className="tab">Створити шаблон</Tab>
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
                  <CustomMessage />
                </TabPanel>
                <TabPanel value={3}>
                  <BirthdayReminders />
                </TabPanel>
                <TabPanel value={4}>
                  <Templates />
                </TabPanel>
                <TabPanel value={5}>
                  <CreateTemplate />
                </TabPanel>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
