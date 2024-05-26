import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getNote, updateNote, deleteNote, reset } from '../../features/notes/noteSlice';
import { savePage } from '../../features/other/otherSlice';
import '../../css/Notes.css';
import '../../index.css';
import Button from '../Button';
import Header from '../Header';
import Navigator from '../Navigator';

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

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
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
      dispatch(savePage(page));
      navigate('/notes');
    }
  };

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    // const isValid =  validateForm();
    if (true) {
      const data = {
        uuid: noteUuid,
        title: title || oneNote.title,
        content: content || oneNote.content,
      };
      await dispatch(updateNote(data));
      alert('Дані нотатку оновлено');
      cancelEditForm();
      await dispatch(getNote(noteUuid));
    } else {
      alert(
        'Помилка при оновленні даних нотатки. Перевірте правильність введених даних.'
      );
    }
  };

  const noteForm = document.getElementById('note-info');
  const buttonsEditDelete = document.getElementsByClassName('note-info-buttons');
  const buttonsSaveCancel = document.getElementsByClassName('note-info-buttons-2');

  const enableEditForm = () => {
    noteForm.querySelectorAll('.card-inputs').forEach((input) => {
      input.removeAttribute('disabled');
    });
    noteForm.querySelectorAll('.card-inputs').forEach((textarea) => {
      textarea.removeAttribute('disabled');
    });
    buttonsEditDelete[0].classList.add('disabled');
    buttonsSaveCancel[0].classList.remove('disabled');
  };

  const cancelEditForm = () => {
    noteForm.querySelectorAll('.card-inputs').forEach((input) => {
      input.setAttribute('disabled', '');
    });
    noteForm.querySelectorAll('.card-inputs').forEach((textarea) => {
      textarea.removeAttribute('disabled');
    });
    buttonsEditDelete[0].classList.remove('disabled');
    buttonsSaveCancel[0].classList.add('disabled');
  };

  // const validateForm = async () => {
  //   if (title === '' || content === '') {
  //     return false;
  //   }
  //   if (title.length > 3 || content.length > 3) {
  //     return false;
  //   }
  //   return true;
  // };

  return (
    <>
      <div className="NoteCard">
        <Navigator />
        <div className="notes-content">
          <Header />
          <div className="notes-body">
            <div className="note-info-main">
              <div className="note-fullname">Нотаток</div>
              <hr className="custom-hr" />
              <form id="note-info" className="note-data">
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
                <div className="note-info-buttons">
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
                </div>
                <div className="note-info-buttons-2 disabled">
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
