import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import '../../index.css';
import { toast } from 'react-toastify';

export default function PlanCard({ plan }) {
  const navigate = useNavigate();
  const { uuid, date, examination, treatment } = plan;

  const handleClick = (e) => {
    e.preventDefault();

    if (localStorage.getItem('user')) {
      navigate(`/patients/tplan/${uuid}`);
    } else if (localStorage.getItem('patient')) {
      navigate(`/patientspage/treatmentplans/get/${uuid}`);
    } else {
      toast.error('Помилка в рендерингу PlanCard', {
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
  };

  return (
    <Card
      sx={{
        minWidth: 315,
        backgroundColor: 'var(--powder-blue)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
          {date}
        </Typography>
        <Typography noWrap variant="body2">
          {examination ? examination : 'Немає даних'}
        </Typography>
        <Typography noWrap variant="body2">
          {treatment}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          sx={{ cursor: 'pointer', fontWeight: 'bold', color: 'white' }}
          // onClick={() => navigate(`/patients/tplan/${uuid}`)}
          onClick={(e) => handleClick(e)}
        >
          Відкрити
        </Button>
      </CardActions>
    </Card>
  );
}
