import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function Template({ template }) {
  const navigate = useNavigate();
  const { uuid, name, body } = template;

  return (
    <Card
      sx={{
        minWidth: 275,
        backgroundColor: 'lightgoldenrodyellow',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {name}
        </Typography>
        <Typography noWrap variant="body2">
          {body}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          sx={{ cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => navigate(`/mailingsystem/edit/${uuid}`)}
        >
          Відкрити
        </Button>
      </CardActions>
    </Card>
  );
}
