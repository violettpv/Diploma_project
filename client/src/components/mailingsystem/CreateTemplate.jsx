import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTemplate, reset } from '../../features/mailingsystem/msysSlice';
import '../../css/MailingSystem.css';
import '../../index.css';
import Button from '../Button';
import { toast } from 'react-toastify';

export default function CreateTemplate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { template, isError, message } = useSelector((state) => state.msystem);

  const [name, setName] = useState('');
  const [body, setBody] = useState('');

  const templateFormRef = useRef(null);

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

    return () => {
      dispatch(reset());
    };
  }, [navigate, isError, message, dispatch]);

  const validateForm = () => {
    let name = templateFormRef.current['name'].value;
    let body = templateFormRef.current['body'].value;

    if (name === '' || body === '') {
      toast.error("Заповніть обов'язкові поля: назва та вміст шаблону.", {
        position: 'top-right',
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (name.lenght <= 3) {
      toast.error('Назва шаблону закоротка', {
        position: 'top-right',
        autoClose: 1800,
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

  const onSubmitCreate = async (e) => {
    e.preventDefault();
    let isValid = validateForm();
    if (isValid) {
      const data = {
        name: name,
        body: body,
      };
      await dispatch(createTemplate(data));
      toast.success('Шаблон створено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      navigate('/mailingsystem/templates');
    } else {
      toast.error('Помилка при створенні шаблону', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const handleCancel = () => {
    setName('');
    setBody('');
  };

  return (
    <div className="CreateTemplate">
      <div className="template-info-header">
        <div className="template-header">Cтворити шаблон</div>
        <hr className="custom-hr" />
      </div>
      <form id="create-template" name="create-template" ref={templateFormRef}>
        <div>
          <label htmlFor="name">Назва:</label>
          <input
            id="name"
            name="name"
            type="text"
            className="card-inputs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="body">Вміст:</label>
          <textarea
            id="body"
            name="body"
            type="text"
            className="card-inputs"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </form>
      <div className="template-buttons">
        <Button
          form="create-template"
          type="button"
          onClick={(e) => onSubmitCreate(e)}
          text="Зберегти"
          color="var(--piction-blue)"
        />
        <Button
          form="create-template"
          type="button"
          onClick={handleCancel}
          text="Скасувати"
          color="gray"
        />
      </div>
    </div>
  );
}
