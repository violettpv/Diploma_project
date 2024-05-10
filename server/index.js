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
app.use('/api/services', require('./routes/serviceRoute'));
app.use('/api/anamnesis', require('./routes/anamnesisRoute'));
app.use('/api/dispensary', require('./routes/dispensaryRoute'));
app.use('/api/form043', require('./routes/form043Route'));
app.use('/api/tplan', require('./routes/treatmentPlanRoute'));
app.use('/api/docsdiary', require('./routes/doctorsDiaryRoute'));
app.use('/api/patientspage', require('./routes/patientsPageRoute'));
app.use('/api/msgtemplate', require('./routes/messageTemplateRoute'));
app.use('/api/appointments', require('./routes/appointmentRoute'));
app.use('/api/dentalformula', require('./routes/dentalFormulaRoute'));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
