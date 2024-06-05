import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNote, reset } from '../../features/notes/noteSlice';
import '../../css/Notes.css';
import '../../index.css';
import Button from '../Button';
import Header from '../Header';
import Navigator from '../Navigator';
import { toast } from 'react-toastify';

export default function CreateNote() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const noteFormRef = useRef(null);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/notes');
  };

  const validateForm = async () => {
    let title = noteFormRef.current['title'].value;
    let content = noteFormRef.current['content'].value;

    if (title === '' || content === '') {
      return false;
    }
    if (title.length <= 3 || content.length <= 3) {
      return false;
    }
    return true;
  };

  const onSubmitCreate = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const data = {
        title: title,
        content: content,
      };
      await dispatch(createNote(data));
      toast.success('Нотаток створено', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      navigate('/notes');
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

  return (
    <>
      <div className="NoteCard">
        <Navigator />
        <div className="notes-content">
          <Header />
          <div className="notes-body">
            <div className="create-note-main">
              <div className="note-fullname">Створити нотаток</div>
              <hr className="custom-hr" />
              <form id="create-note" name="create-note" ref={noteFormRef}>
                <div className="note-data-row">
                  <label>
                    <span>Назва:</span>
                    <input
                      name="title"
                      type="text"
                      className="card-inputs"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </label>
                </div>
                <div className="note-data-row">
                  <label>
                    <span>Вміст:</span>
                    <textarea
                      name="content"
                      type="text"
                      className="card-inputs"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </label>
                </div>
              </form>
              <div className="note-info-buttons-both">
                <div className="note-info-buttons">
                  <Button
                    form="create-note"
                    type="button"
                    onClick={(e) => onSubmitCreate(e)}
                    text="Зберегти"
                    color="var(--piction-blue)"
                  />
                  <Button
                    form="create-note"
                    type="button"
                    onClick={(e) => handleCancel(e)}
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
