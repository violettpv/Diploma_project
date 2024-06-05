import React, { useEffect, useState } from 'react';
import '../../css/Appointments.css';
import '../../index.css';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button';
import { toast } from 'react-toastify';
import {
  addReceipt,
  getAppointment,
  reset,
} from '../../features/appointments/appointmentSlice';
import {
  getServices,
  reset as resetServices,
} from '../../features/services/serviceSlice';

export default function AddReceipt() {
  const params = useParams();
  const appointmentUuid = params.uuid;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { oneAppointment, isError, message } = useSelector((state) => state.appointments);
  const { services } = useSelector((state) => state.services);

  const [serviceEntries, setServiceEntries] = useState([{ service: '', quantity: '' }]);
  const [sale, setSale] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

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

    dispatch(getServices());
    dispatch(getAppointment(appointmentUuid));

    return () => {
      dispatch(resetServices());
      dispatch(reset());
    };
  }, [dispatch, isError, message, appointmentUuid]);

  const handleServiceChange = (index, event) => {
    const { name, value } = event.target;
    const newServiceEntries = [...serviceEntries];

    if (name === 'quantity' && (value <= 0 || value === '')) {
      toast.error('Кількість повинна бути більше 0', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    newServiceEntries[index][name] = value;
    setServiceEntries(newServiceEntries);
    calculateTotalPrice(newServiceEntries);
  };

  const handleAddService = () => {
    setServiceEntries([...serviceEntries, { service: '', quantity: '' }]);
  };

  const handleRemoveService = (index) => {
    const newServiceEntries = [...serviceEntries];
    newServiceEntries.splice(index, 1);
    setServiceEntries(newServiceEntries);
    calculateTotalPrice(newServiceEntries);
  };

  const calculateTotalPrice = (entries) => {
    let total = 0;
    entries.forEach((entry) => {
      const service = services.find((s) => s.uuid === entry.service);
      if (service && entry.quantity) {
        total += service.price * parseInt(entry.quantity, 10);
      }
    });
    setTotalPrice(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const services = serviceEntries.map((entry) => entry.service);
      const quantities = serviceEntries.map((entry) => entry.quantity);

      await dispatch(
        addReceipt({
          services,
          quantities,
          sale,
          uuid: appointmentUuid,
        })
      );
      toast.success('Рахунок створено', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      navigate('/appointments');
    }
  };

  const validateForm = () => {
    for (let entry of serviceEntries) {
      if (!entry.service || !entry.quantity) {
        toast.error('Заповніть всі поля для всіх послуг та кількостей!', {
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
      if (entry.quantity <= 0) {
        toast.error('Кількість повинна бути більше 0', {
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
      if (entry.service === null) {
        toast.error('Оберіть послугу', {
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
    }
    if (serviceEntries.length === 0) {
      toast.error('Заповніть всі поля для всіх послуг та кількостей!', {
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
    if (sale < 0 || sale > 100) {
      toast.error('Знижка повинна бути від 0 до 100', {
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

  return (
    <>
      <div className="AddReceipt">
        <Navigator />
        <div className="appointments-content">
          <Header />
          <div className="create-appointment-body">
            <div className="add-receipt-main">
              {oneAppointment.patient && (
                <div className="create-appointment-intro">
                  Створити рахунок до запису:{' '}
                  {`${oneAppointment.patient.surname} ${oneAppointment.patient.name} ${oneAppointment.patient.patronymic}`}
                  , {oneAppointment.date},{' '}
                  {oneAppointment.startTime && oneAppointment.startTime.slice(0, 5)}
                </div>
              )}
              <hr className="custom-hr" />
              <form name="add-receipt" id="add-receipt-form" onSubmit={handleSubmit}>
                {serviceEntries.map((entry, index) => (
                  <div key={index} className="add-receipt-form-row">
                    <select
                      name="service"
                      value={entry.service}
                      onChange={(event) => handleServiceChange(index, event)}
                    >
                      <option value="">Оберіть послугу</option>
                      {services.map((service) => (
                        <option key={service.uuid} value={service.uuid}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="quantity"
                      value={entry.quantity}
                      placeholder="Кількість"
                      onChange={(event) => handleServiceChange(index, event)}
                      min="1"
                      max="100"
                    />
                    <button
                      type="button"
                      id="delete-service-input"
                      onClick={() => handleRemoveService(index)}
                    >
                      Видалити
                    </button>
                  </div>
                ))}
                <button type="button" id="add-service-input" onClick={handleAddService}>
                  Додати ще поле
                </button>
                <div className="add-receipt-form-row-footer">
                  <label htmlFor="sale" className="receipt-text">
                    Знижка (%)
                  </label>
                  <input
                    min="0"
                    max="100"
                    type="number"
                    id="sale"
                    name="sale"
                    value={sale}
                    onChange={(e) => setSale(e.target.value)}
                  />
                </div>
                <div className="add-receipt-form-row-footer">
                  <label className="receipt-text">Загальна сума:&nbsp;</label>
                  <span>{totalPrice}</span>
                </div>
              </form>
              <div className="add-receipt-buttons">
                <Button
                  form="add-receipt"
                  type="submit"
                  text="Створити рахунок"
                  color="var(--piction-blue)"
                  onClick={(e) => handleSubmit(e)}
                />
                <Button
                  form="add-receipt"
                  type="button"
                  text="Скасувати"
                  color="gray"
                  onClick={() => navigate('/appointments')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
