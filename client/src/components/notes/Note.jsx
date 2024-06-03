import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function Note({ note }) {
  const navigate = useNavigate();
  const { uuid, title, content, createdAt } = note;

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
          {createdAt && createdAt.split('T')[0].split('-').reverse().join('.')}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          sx={{ cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => navigate(`/notes/get/${uuid}`)}
        >
          Відкрити
        </Button>
      </CardActions>
    </Card>
  );
}
