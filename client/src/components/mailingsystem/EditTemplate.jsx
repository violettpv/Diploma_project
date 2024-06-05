import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  getTemplate,
  deleteTemplate,
  updateTemplate,
  reset,
} from '../../features/mailingsystem/msysSlice';
import '../../css/MailingSystem.css';
import '../../index.css';
import Button from '../Button';
import Header from '../Header';
import Navigator from '../Navigator';
import { toast } from 'react-toastify';

export default function EditTemplate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const params = useParams();
  const templateUuid = params.uuid;

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { oneTemplate, isError, message } = useSelector((state) => state.msystem);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');

  const templateFormRef = useRef(null);
  const buttonsEditDeleteRef = useRef(null);
  const buttonsSaveCancelRef = useRef(null);

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

    dispatch(getTemplate(templateUuid));

    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, templateUuid]);

  const onSubmitDelete = async (e) => {
    e.preventDefault();
    MySwal.fire({
      title: 'Ви впевнені?',
      text: 'Хочете видалити цей шаблон?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--piction-blue)',
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTemplate(templateUuid));
        toast.success('Шаблон видалено', {
          position: 'top-right',
          autoClose: 1200,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        navigate('/mailingsystem');
      }
    });
  };

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const data = {
        uuid: templateUuid,
        name: name || oneTemplate.name,
        body: body || oneTemplate.body,
      };
      await dispatch(updateTemplate(data));
      toast.success('Шаблон оновлено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      cancelEditForm();
      await dispatch(getTemplate(templateUuid));
    } else {
      toast.error(
        'Помилка при оновленні шаблону. Перевірте правильність введених даних.',
        {
          position: 'top-right',
          autoClose: 1500,
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

  const enableEditForm = () => {
    templateFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });
    buttonsEditDeleteRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
  };

  const cancelEditForm = () => {
    setName(oneTemplate.name);
    setBody(oneTemplate.body);
    templateFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    buttonsEditDeleteRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
  };

  const validateForm = () => {
    let name = templateFormRef.current['name'].value;
    let body = templateFormRef.current['body'].value;
    if (name === '' || body === '') {
      toast.error(
        'Помилка при оновленні шаблону. Перевірте правильність введених даних.',
        {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
      return false;
    }
    if (name.length <= 3 || body.length <= 3) {
      toast.error('Помилка при оновленні шаблону. Закороткий вміст.', {
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
      <div className="EditTemplate">
        <Navigator />
        <div className="template-content">
          <Header />
          <div className="template-body">
            <div className="template-info-main">
              <div className="template-info-header">
                <div className="template-header">Шаблон</div>
                <hr className="custom-hr" />
              </div>
              <form id="template" name="template" ref={templateFormRef}>
                <div className="template-element">
                  <label htmlFor="name">Назва:</label>
                  <input
                    name="name"
                    type="text"
                    className="card-inputs"
                    disabled
                    defaultValue={oneTemplate.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="template-element">
                  <label htmlFor="body">Вміст:</label>
                  <textarea
                    name="body"
                    type="text"
                    className="card-inputs"
                    disabled
                    defaultValue={oneTemplate.body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              </form>
              <div className="template-buttons-both">
                <div className="template-buttons" ref={buttonsEditDeleteRef}>
                  <Button
                    form="template"
                    type="button"
                    onClick={enableEditForm}
                    text="Редагувати"
                    color="var(--piction-blue)"
                  />
                  <Button
                    form="template"
                    type="button"
                    onClick={(e) => onSubmitDelete(e)}
                    text="Видалити"
                    color="var(--delete-button-color)"
                  />
                  <Button
                    form="template"
                    type="button"
                    onClick={() => navigate('/mailingsystem')}
                    text="Назад"
                    color="gray"
                  />
                </div>
                <div className="template-buttons-2 disabled" ref={buttonsSaveCancelRef}>
                  <Button
                    form="template"
                    type="button"
                    onClick={(e) => onSubmitUpdate(e)}
                    text="Зберегти"
                    color="var(--piction-blue)"
                  />
                  <Button
                    form="template"
                    type="button"
                    onClick={cancelEditForm}
                    text="Скасувати"
                    color="gray"
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
