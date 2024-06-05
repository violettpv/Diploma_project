import React, { useEffect, useState } from 'react';
import '../css/Notes.css';
import '../index.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import Note from '../components/notes/Note';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllNotes, reset } from '../features/notes/noteSlice';
import Pagination from '@mui/material/Pagination';
import { toast } from 'react-toastify';

export default function Notes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { notes, isError, message } = useSelector((state) => state.notes);

  const [page, setPage] = useState(1);
  const notesPerPage = 12;

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

    dispatch(getAllNotes());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  const handleCreateNote = (e) => {
    e.preventDefault();
    navigate('/notes/create');
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const displayedNotes = notes.slice((page - 1) * notesPerPage, page * notesPerPage);

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
                  onClick={(e) => handleCreateNote(e)}
                >
                  Додати нотаток
                </button>
              </div>
              <div className="notes-list">
                {displayedNotes.map((note) => (
                  <Note key={note.uuid} note={note} />
                ))}
              </div>
              <Pagination
                count={Math.ceil(notes.length / notesPerPage)}
                page={page}
                onChange={handleChangePage}
                sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
