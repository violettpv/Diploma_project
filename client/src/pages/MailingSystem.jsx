import React, { useEffect } from 'react';
import '../css/MailingSystem.css';
import '../index.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import { useNavigate, useParams } from 'react-router-dom';
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

  const { tab } = useParams();

  const handleTabChange = (event, newValue) => {
    event.preventDefault();
    navigate(`/mailingsystem/${newValue}`);
  };

  return (
    <>
      <div className="MailingSystem">
        <Navigator />
        <div className="msys-content">
          <Header />
          <div className="msys-body">
            <Tabs
              className="msys-card-tabs"
              // defaultValue={0}
              value={tab}
              onChange={handleTabChange}
              orientation="vertical"
            >
              <TabsList className="msys-tabs-list">
                <Tab className="tab" value="info">
                  Інформація
                </Tab>
                <Tab className="tab" value="appointments">
                  Нагадування про візит
                </Tab>
                <Tab className="tab" value="custom-message">
                  Відправити повідомлення
                </Tab>
                <Tab className="tab" value="birthdays">
                  Привітання з ДН
                </Tab>
                <Tab className="tab" value="templates">
                  Шаблони
                </Tab>
                <Tab className="tab" value="create-template">
                  Створити шаблон
                </Tab>
              </TabsList>
              <hr className="custom-hr" />
              <div className="msys-card-main">
                <TabPanel
                  // value={0}
                  value="info"
                >
                  <MSysInfo />
                </TabPanel>
                <TabPanel
                  //value={1}
                  value="appointments"
                >
                  <AppointmentReminders />
                </TabPanel>
                <TabPanel
                  // value={2}
                  value="custom-message"
                >
                  <CustomMessage />
                </TabPanel>
                <TabPanel
                  // value={3}
                  value="birthdays"
                >
                  <BirthdayReminders />
                </TabPanel>
                <TabPanel
                  // value={4}
                  value="templates"
                >
                  <Templates />
                </TabPanel>
                <TabPanel
                  // value={5}
                  value="create-template"
                >
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
