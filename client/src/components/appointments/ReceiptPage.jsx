import React, { useEffect, useState } from 'react';
import '../../css/Appointments.css';
import '../../index.css';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button';
import {
  getReceipt,
  deleteReceipt,
  payReceipt,
  reset,
} from '../../features/appointments/appointmentSlice';

export default function ReceiptPage() {
  const params = useParams();
  const receiptUuid = params.uuid;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { oneReceipt, isError, isSuccess, message } = useSelector(
    (state) => state.appointments
  );
  const [serviceEntries, setServiceEntries] = useState([
    { serviceUuid: '', serviceName: '', quantity: '', price: '' },
  ]);
  const [sale, setSale] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }

    dispatch(getReceipt(receiptUuid));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message, receiptUuid]);

  useEffect(() => {
    if (isSuccess) {
      setServiceEntries(
        oneReceipt.services.map((service) => ({
          serviceUuid: service.receiptService.uuid,
          serviceName: service.name,
          price: service.price,
          quantity: service.receiptService.quantity,
        }))
      );
      setSale(oneReceipt.sale);
      setTotalPrice(oneReceipt.total);
    }
  }, [isSuccess]);

  const handleDelete = () => {
    if (window.confirm('Ви впевнені, що хочете видалити цей рахунок?')) {
      dispatch(deleteReceipt(receiptUuid));
      alert('Рахунок видалено');
      navigate('/appointments');
    }
  };

  const handlePayment = (method) => {
    if (
      window.confirm(
        `Ви впевнені, що хочете оплатити цей рахунок ${
          method === 'card' ? 'карткою' : 'готівкою'
        }?`
      )
    ) {
      dispatch(payReceipt({ uuid: receiptUuid, paymentType: method }));
      alert('Рахунок оплачено');
      navigate('/appointments');
    }
  };

  return (
    <>
      <div className="AddReceipt">
        <Navigator />
        <div className="appointments-content">
          <Header />
          <div className="create-appointment-body">
            <div className="add-receipt-main">
              <div className="receipt-details">
                <div className="receipt-info">
                  <h2 style={{ color: 'var(--charcoal)' }}>Рахунок</h2>
                  <hr className="custom-hr" />
                  <div className="receipt-services">
                    {serviceEntries &&
                      serviceEntries.map((service, index) => (
                        <div key={index} className="service-entry">
                          <p>Послуга: {service.serviceName}</p>
                          <p>Кількість: {service.quantity}</p>
                          <p>Ціна за одиницю: {service.price}</p>
                          <p>Сума: {service.price * service.quantity}</p>
                        </div>
                      ))}
                  </div>
                  <hr className="custom-hr" />
                  <div className="receipt-sum">
                    <p>Знижка: {oneReceipt.sale}%</p>
                    <p>Загальна сума: {oneReceipt.total}</p>
                    {oneReceipt.isPaid !== false ? (
                      <p>
                        Оплачено:{' '}
                        {oneReceipt.paymentType === 'cash' ? 'готівка' : 'картка'}
                      </p>
                    ) : (
                      <p>Не оплачено</p>
                    )}
                  </div>
                </div>
                <div className="receipt-actions">
                  <Button
                    type="button"
                    text="Видалити рахунок"
                    color="var(--delete-button-color)"
                    onClick={handleDelete}
                  />
                  <Button
                    type="button"
                    text="Оплатити карткою"
                    color="#d19d3d"
                    onClick={() => handlePayment('card')}
                    disabled={oneReceipt.isPaid}
                  />
                  <Button
                    type="button"
                    text="Оплатити готівкою"
                    color="#3cba68"
                    onClick={() => handlePayment('cash')}
                    disabled={oneReceipt.isPaid}
                  />
                  <Button
                    type="button"
                    text="Назад"
                    color="gray"
                    onClick={() => navigate('/appointments')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}