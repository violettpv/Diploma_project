// import * as React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// import { getNote, updateNote, reset } from '../features/notes/noteSlice';

// export default function NoteCard({ data }) {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { note, isError, message } = useSelector((state) => state.notes);

//   return (
//     <Card sx={{ width: 250, maxHeight: 150, margin: 1 }}>
//       <CardContent sx={{ padding: '10px 10px 0 10px' }}>
//         <Typography sx={{ fontSize: 13 }} color="text.secondary" gutterBottom>
//           <span id="note-date-creation">
//             {new Date(data.created_at).toLocaleString('uk-UA')}
//           </span>
//         </Typography>
//         <Typography
//           component="div"
//           style={{
//             fontSize: 16,
//             height: '70px',
//             textOverflow: 'ellipsis',
//             overflow: 'hidden',
//           }}
//         >
//           <span id="note-text">{data.content}</span>
//         </Typography>
//       </CardContent>
//       <CardActions
//         sx={{
//           padding: '5px 8px 8px 8px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         {/* <RouterLink to={`/notes/${data.id}`}>
//           <Button size="small">Відкрити</Button>
//         </RouterLink> */}
//         {/* <DeleteButton deleteData={data.id} handleDelete={handleDelete} /> */}
//       </CardActions>
//     </Card>
//   );
// }
