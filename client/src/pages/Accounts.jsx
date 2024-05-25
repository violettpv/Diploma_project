import React from 'react';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import '../css/Accounts.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/user/userSlice';
import { FaSignOutAlt } from 'react-icons/fa';
import { Tabs } from '@mui/base/Tabs';
import { TabsList } from '@mui/base/TabsList';
import { TabPanel } from '@mui/base/TabPanel';
import { Tab } from '@mui/base/Tab';

export default function Accounts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = async () => {
    await dispatch(logout());
    dispatch(reset);
    navigate('/login');
  };
  return (
    <>
      <div className="Accounts">
        <Navigator />
        <div className="accounts-content">
          <Header />
          <div className="accounts-body">
            <div className="accounts-main">
              <Tabs defaultValue={0}>
                <div className="tabs-logout">
                  <div className="tabs">
                    <TabsList className="tabs-list">
                      <Tab className="tab" value={0}>
                        Мій акаунт
                      </Tab>
                      <Tab className="tab" value={1}>
                        Працівники
                      </Tab>
                      <Tab className="tab" value={2}>
                        Клініка
                      </Tab>
                    </TabsList>
                  </div>
                  <div className="logout-container">
                    <button className="tooltip" id="logout-button" onClick={logOut}>
                      <FaSignOutAlt />
                      <span class="tooltiptext">Вийти</span>
                    </button>
                  </div>
                </div>
                <div className="accounts-hr">
                  <hr />
                </div>
                <div className="tab-panel">
                  <TabPanel value={0}>Мій акаунт</TabPanel>
                  <TabPanel value={1}>Працівники</TabPanel>
                  <TabPanel value={2}>Клініка</TabPanel>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
