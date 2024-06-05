import React, { useEffect, useState } from 'react';
import '../../css/Services.css';
import Header from '../Header';
import Navigator from '../Navigator';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createService } from '../../features/services/serviceSlice';
import { toast } from 'react-toastify';

export default function AddService() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serviceData, setServiceData] = useState({ name: '', price: '' });
  const { name, price } = serviceData;

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (!user || user.role !== 'main') {
      navigate('/services');
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
    }
  }, []);

  const onChange = (e) => {
    setServiceData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = async () => {
    let name = serviceData.name;
    let price = serviceData.price;
    if (name === '' || price === '') {
      toast.error('Заповніть обов’язкові поля: назва послуги, ціна послуги.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (name.length > 200) {
      toast.error('Назва послуги занадто довга. Максимальна довжина 200 символів.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (!price.match(/^\d+(\.\d{1,2})?$/)) {
      toast.error('Невірний формат ціни послуги. Введіть у форматі 123.45.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    return true;
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    let isValid = await validateForm();
    if (isValid) {
      const serviceData = { name, price };
      dispatch(createService(serviceData));
      toast.success('Послугу створено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setServiceData({ name: '', price: '' });
      navigate('/services');
    } else {
      toast.error(
        'Помилка при створенні послуги. Перевірте правильність введених даних.',
        {
          position: 'top-right',
          autoClose: 1700,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
    }
  };

  return (
    <>
      <div className="Services">
        <Navigator />
        <div className="services-content">
          <Header />
          <div className="add-service-body">
            <div className="add-service-main">
              <form className="add-service-form">
                <div className="add-service-title">Додати послугу у прайс-лист</div>
                <hr />
                <div className="add-service-inputs-buttons">
                  <div className="add-service-inputs">
                    <div className="add-service-input">
                      <label htmlFor="service-name">Назва послуги</label>
                      <input
                        id="service-name"
                        type="text"
                        name="name"
                        value={name}
                        onChange={onChange}
                      />
                    </div>
                    <div className="add-service-input">
                      <label htmlFor="service-price">Ціна послуги</label>
                      <input
                        id="service-price"
                        type="text"
                        name="price"
                        value={price}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="add-service-buttons">
                    <button
                      className="service-buttons"
                      type="button"
                      form="add-service-form"
                      onClick={(e) => handleCreateService(e)}
                    >
                      Додати
                    </button>
                    <button
                      className="service-buttons"
                      style={{ backgroundColor: 'var(--charcoal)' }}
                      type="button"
                      onClick={() => navigate('/services')}
                    >
                      Скасувати
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
