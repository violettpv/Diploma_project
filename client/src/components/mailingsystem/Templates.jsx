import React, { useEffect, useState } from 'react';
import '../../css/MailingSystem.css';
import '../../index.css';
import Template from '../../components/mailingsystem/Template';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTemplates, reset } from '../../features/mailingsystem/msysSlice';
import Pagination from '@mui/material/Pagination';
import { toast } from 'react-toastify';

export default function Templates() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const { templates, isError, message } = useSelector((state) => state.msystem);

  const [page, setPage] = useState(1);
  const templatesPerPage = 12;

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

    dispatch(getAllTemplates());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // create a list without 'scheduled visit' template
  const displayedTemplates = templates
    .filter((template) => template.uuid !== '6d5c51a9-49c6-4510-8de3-afa55dc8ee8f')
    .slice((page - 1) * templatesPerPage, page * templatesPerPage);

  return (
    <>
      <div className="Templates">
        <div className="templates-list">
          {displayedTemplates.map((template) => (
            <Template key={template.uuid} template={template} />
          ))}
        </div>
        <Pagination
          count={Math.ceil(templates.length / templatesPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
        />
      </div>
    </>
  );
}
