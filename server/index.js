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

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
