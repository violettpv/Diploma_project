import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNote, reset } from '../../features/notes/noteSlice';
import '../../css/Notes.css';
import '../../index.css';
import Button from '../Button';
import Header from '../Header';
import Navigator from '../Navigator';

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

  const handleCancel = async (e) => {
    e.preventDefault();
    navigate('/notes');
  };

  const validateForm = async () => {
    let title = document.forms['note-info']['title'].value;
    let content = document.forms['note-info']['content'].value;
    if (title === '' || content === '') {
      return false;
    }
    if (title.length > 3 || content.length > 3) {
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
      alert('Нотаток створено');
      navigate('/notes');
    } else {
      alert(
        'Помилка при оновленні даних нотатки. Перевірте правильність введених даних.'
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
                      className="card-inputs"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </label>
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
                    form="note-info"
                    type="button"
                    onClick={(e) => onSubmitCreate(e)}
                    text="Зберегти"
                    color="var(--piction-blue)"
                  />
                  <Button
                    form="note-info"
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
