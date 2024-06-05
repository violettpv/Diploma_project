import React, { useEffect, useState } from 'react';
import '../../css/Appointments.css';
import '../../index.css';
import Header from '../../components/Header';
import Navigator from '../../components/Navigator';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
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
  const MySwal = withReactContent(Swal);
  const { oneReceipt, isError, isSuccess, message } = useSelector(
    (state) => state.appointments
  );
  const [serviceEntries, setServiceEntries] = useState([
    { serviceUuid: '', serviceName: '', quantity: '', price: '' },
  ]);
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
    MySwal.fire({
      title: 'Ви впевнені?',
      text: 'Хочете видалити цей рахунок?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--piction-blue)',
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteReceipt(receiptUuid));
        toast.success('Рахунок видалено', {
          position: 'top-right',
          autoClose: 1200,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        navigate('/appointments');
      }
    });
  };

  const handlePayment = (method) => {
    MySwal.fire({
      title: 'Ви впевнені?',
      text: `Ви хочете оплатити цей рахунок ${
        method === 'card' ? 'карткою' : 'готівкою'
      }?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(payReceipt({ uuid: receiptUuid, paymentType: method }));
        toast.success('Рахунок оплачено', {
          position: 'top-right',
          autoClose: 1200,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        navigate('/appointments');
      }
    });
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
                  {oneReceipt.isPaid === false && (
                    <>
                      <Button
                        type="button"
                        text="Оплатити карткою"
                        color="#d19d3d"
                        onClick={() => handlePayment('card')}
                      />
                      <Button
                        type="button"
                        text="Оплатити готівкою"
                        color="#3cba68"
                        onClick={() => handlePayment('cash')}
                      />
                    </>
                  )}
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
