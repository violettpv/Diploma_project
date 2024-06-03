import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getNote, updateNote, deleteNote, reset } from '../../features/notes/noteSlice';
import { savePage } from '../../features/other/otherSlice';
import '../../css/Notes.css';
import '../../index.css';
import Button from '../Button';
import Header from '../Header';
import Navigator from '../Navigator';
import { toast } from 'react-toastify';

export default function NoteCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const noteUuid = params.uuid;

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { oneNote, isError, message } = useSelector((state) => state.notes);
  const { page } = useSelector((state) => state.other);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const noteFormRef = useRef(null);
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

    dispatch(getNote(noteUuid));
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, noteUuid]);

  if (!oneNote) {
    return <div>Loading...</div>;
  }

  const onSubmitDelete = async (e) => {
    e.preventDefault();
    if (window.confirm('Ви впевнені, що хочете видалити цей нотаток?')) {
      await dispatch(deleteNote(noteUuid));
      alert('Нотаток видалено');
      toast.success('Нотаток видалено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      dispatch(savePage(page));
      navigate('/notes');
    }
  };

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const data = {
        uuid: noteUuid,
        title: title || oneNote.title,
        content: content || oneNote.content,
      };
      await dispatch(updateNote(data));
      toast.success('Дані нотатку оновлено', {
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
      await dispatch(getNote(noteUuid));
    } else {
      toast.error(
        'Помилка при оновленні даних нотатки. Перевірте правильність введених даних.',
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
    noteFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });
    noteFormRef.current.querySelectorAll('.card-inputs').forEach((textarea) => {
      textarea.removeAttribute('disabled');
    });
    buttonsEditDeleteRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
  };

  const cancelEditForm = () => {
    noteFormRef.current.querySelectorAll('.card-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    noteFormRef.current.querySelectorAll('.card-inputs').forEach((textarea) => {
      textarea.removeAttribute('disabled');
    });
    buttonsEditDeleteRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
  };

  const validateForm = () => {
    let title = noteFormRef.current['title'].value;
    let content = noteFormRef.current['content'].value;
    if (title === '' || content === '') {
      toast.error(
        'Помилка при оновленні даних нотатки. Перевірте правильність введених даних.',
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
    if (title.length <= 3 || content.length <= 3) {
      toast.error('Помилка при оновленні даних нотатки. Закороткий вміст.', {
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
      <div className="NoteCard">
        <Navigator />
        <div className="notes-content">
          <Header />
          <div className="notes-body">
            <div className="note-info-main">
              <div className="note-info-header">
                <div className="note-fullname">Нотаток</div>
                <hr className="custom-hr" />
              </div>
              <form id="note-info" name="note-info" ref={noteFormRef}>
                <div className="note-data-row">
                  <label>
                    <span>Назва:</span>
                    <input
                      name="title"
                      type="text"
                      disabled
                      className="card-inputs"
                      defaultValue={oneNote.title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Вміст:</span>
                    <textarea
                      name="content"
                      type="text"
                      disabled
                      className="card-inputs"
                      defaultValue={oneNote.content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Дата створення:</span>
                    <input
                      readOnly
                      name="createdAt"
                      type="text"
                      className="card-inputs"
                      defaultValue={
                        oneNote.createdAt &&
                        oneNote.createdAt.split('T')[0].split('-').reverse().join('.')
                      }
                    />
                  </label>
                </div>
              </form>
              <div className="note-info-buttons-both">
                <div className="note-info-buttons" ref={buttonsEditDeleteRef}>
                  <Button
                    form="note-info"
                    type="button"
                    onClick={enableEditForm}
                    text="Редагувати"
                    color="var(--piction-blue)"
                  />
                  <Button
                    form="note-info"
                    type="button"
                    onClick={(e) => onSubmitDelete(e)}
                    text="Видалити"
                    color="var(--delete-button-color)"
                  />
                  <Button
                    form="note-info"
                    type="button"
                    onClick={() => navigate('/notes')}
                    text="Назад"
                    color="gray"
                  />
                </div>
                <div className="note-info-buttons-2 disabled" ref={buttonsSaveCancelRef}>
                  <Button
                    form="note-info"
                    type="button"
                    onClick={(e) => onSubmitUpdate(e)}
                    text="Зберегти"
                    color="var(--piction-blue)"
                  />
                  <Button
                    form="note-info"
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
