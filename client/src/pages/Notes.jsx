import React, { useEffect, useState } from 'react';
import '../css/Notes.css';
import '../index.css';
import Header from '../components/Header';
import Navigator from '../components/Navigator';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllNotes, reset } from '../features/notes/noteSlice';
import { resetPage, savePage } from '../features/other/otherSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';

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
  const { page } = useSelector((state) => state.other);

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }

    dispatch(getAllNotes());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  const rowsPerPage = 8;
  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    dispatch(savePage(newPage));
  };

  const handleCreateNote = (e) => {
    e.preventDefault();
    navigate('/notes/create');
  };

  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  };

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
                <Paper>
                  <TableContainer sx={{ height: '68vh', width: '1000px' }}>
                    <Table>
                      <TableBody>
                        {notes
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((note) => (
                            <TableRow key={note.uuid}>
                              <TableCell
                                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => navigate(`/notes/get/${note.uuid}`)}
                              >
                                {note.title}
                              </TableCell>
                              <TableCell sx={{ width: '50%' }}>
                                {truncateContent(note.content, 80)}
                              </TableCell>
                              <TableCell>
                                {new Date(note.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={notes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} з ${count}`
                    }
                  />
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
