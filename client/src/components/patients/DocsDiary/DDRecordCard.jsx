import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

export default function DDRecordCard({ record }) {
  const navigate = useNavigate();
  const {
    uuid,
    date,
    complaints,
    anamnesis,
    status,
    diagnosis,
    treatment,
    recommendations,
  } = record;

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/patients/docsdiary/${uuid}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 30 }} size="small" aria-label="a dense table">
        <TableBody sx={{ cursor: 'pointer' }} onClick={(e) => handleClick(e)}>
          <React.Fragment key={uuid}>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Дата:</b>
              </TableCell>
              <TableCell sx={tableCellCss}>
                <b>{date}</b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Скарги:</b>
              </TableCell>
              <TableCell sx={tableCellCss}>{complaints}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Анамнез:</b>
              </TableCell>
              <TableCell sx={tableCellCss}>{anamnesis}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Статус:</b>
              </TableCell>
              <TableCell sx={tableCellCss}>{status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Діагноз:</b>
              </TableCell>
              <TableCell sx={tableCellCss}>{diagnosis}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Лікування:</b>
              </TableCell>
              <TableCell sx={tableCellCss}>{treatment}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <b>Рекомендації:</b>
              </TableCell>
              <TableCell sx={tableCellCss}>{recommendations}</TableCell>
            </TableRow>
          </React.Fragment>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const tableCellCss = {
  display: 'block',
  width: '200px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
