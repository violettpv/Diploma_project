import React, { useEffect, useState } from 'react';
import '../../css/Services.css';
import Header from '../Header';
import Navigator from '../Navigator';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateService, getService, reset } from '../../features/services/serviceSlice';

export default function EditService() {
  const params = useParams();
  const serviceUuid = params.uuid;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { service, isError, message } = useSelector((state) => state.services);
  const [serviceData, setServiceData] = useState({ name: '', price: '' });
  const { name, price } = serviceData;

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }

    dispatch(getService(serviceUuid));
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch]);

  useEffect(() => {
    setServiceData({ name: service.name, price: service.price });
  }, [service]);

  if (!service) {
    return <div>Loading...</div>;
  }

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
      alert('Заповніть обов’язкові поля: назва послуги, ціна послуги.');
      return false;
    }
    if (name.length > 200) {
      alert('Назва послуги занадто довга. Максимальна довжина 200 символів.');
      return false;
    }
    if (!price.match(/^\d+(\.\d{1,2})?$/)) {
      alert('Невірний формат ціни послуги. Введіть у форматі 123.45.');
      return false;
    }
    return true;
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    let isValid = await validateForm();
    if (isValid) {
      const serviceData = {
        uuid: serviceUuid,
        name: name || service.name,
        price: price || service.price,
      };
      dispatch(updateService(serviceData));
      alert('Послугу оновлено');
      navigate('/services');
    } else {
      alert('Помилка при оновленні послуги. Перевірте правильність введених даних.');
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
                <div className="add-service-title">Редагувати послугу у прайс-листі</div>
                <hr />
                <div className="add-service-inputs-buttons">
                  <div className="add-service-inputs">
                    <div className="add-service-input">
                      <label htmlFor="service-name">Назва послуги</label>
                      <input
                        id="service-name"
                        type="text"
                        name="name"
                        defaultValue={service.name}
                        onChange={onChange}
                      />
                    </div>
                    <div className="add-service-input">
                      <label htmlFor="service-price">Ціна послуги</label>
                      <input
                        id="service-price"
                        type="text"
                        name="price"
                        defaultValue={service.price}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="add-service-buttons">
                    <button
                      className="service-buttons"
                      type="button"
                      onClick={(e) => handleUpdateService(e)}
                    >
                      Зберегти
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
