import React from 'react';
import '../css/Notes.css';
import '../index.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import NoteCard from '../components/notes/NoteCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getNotes } from '../features/notes/noteSlice';

export default function Notes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { notes, isError, message } = useSelector((state) => state.notes);
  return (
    <>
      <div className="Notes">
        <Navigator />
        <div className="notes-content">
          <Header />
          <div className="notes-body">
            <div className="notes-main">
              <div className="notes-main-header">
                <div id="notes-title">Нотатки</div>
                <button
                  id="create-note-button"
                  className="notes-buttons"
                  type="button"
                  // onClick={() => console.log('Create note')}
                >
                  Додати нотаток
                </button>
              </div>
              <div className="notes-list">
                {/* {notes.map((note) => (
                  <NoteCard key={note.id} data={note} />
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
