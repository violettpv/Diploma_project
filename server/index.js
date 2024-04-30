const express = require('express');
const dotenv = require('dotenv').config({ path: __dirname + '/../.env' });
const port = process.env.PORT || 5000;

const { db, syncTables } = require('./config/db');
db.authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
syncTables();

const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/clinic', require('./routes/clinicRoute'));
app.use('/api/patients', require('./routes/patientRoute'));
app.use('/api/notes', require('./routes/noteRoute'));
// app.use('/api/services', require('./routes/serviceRoute'));
// app.use('/api/diseases', require('./routes/diseaseRoute'));
// app.use('/api/appointments', require('./routes/appointmentRoute'));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
