import React, { useEffect } from 'react';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import '../css/Accounts.css';
import '../index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/user/userSlice';
import { FaSignOutAlt } from 'react-icons/fa';
import { Tabs } from '@mui/base/Tabs';
import { TabsList } from '@mui/base/TabsList';
import { TabPanel } from '@mui/base/TabPanel';
import { Tab } from '@mui/base/Tab';
import UserPage from '../components/accounts/UserPage';
import Clinic from '../components/accounts/Clinic';
import Users from '../components/accounts/Users';
import CreateUser from '../components/accounts/CreateUser';

export default function Accounts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const logOut = async () => {
    await dispatch(logout());
    dispatch(reset());
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
                        Клініка
                      </Tab>
                      <Tab className="tab" value={2}>
                        Працівники
                      </Tab>
                      <Tab className="tab" value={3}>
                        Додати працівника
                      </Tab>
                    </TabsList>
                  </div>
                  <div className="logout-container">
                    <button className="tooltip" id="logout-button" onClick={logOut}>
                      <FaSignOutAlt />
                      <span className="tooltiptext">Вийти</span>
                    </button>
                  </div>
                </div>
                <hr className="custom-hr" />
                <div className="tab-panel">
                  <TabPanel value={0}>
                    <UserPage />
                  </TabPanel>
                  <TabPanel value={1}>
                    <Clinic />
                  </TabPanel>
                  <TabPanel value={2}>
                    <Users />
                  </TabPanel>
                  <TabPanel value={3}>
                    <CreateUser />
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
