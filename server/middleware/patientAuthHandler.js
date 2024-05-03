const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');

const protectPatient = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const patient = await Patient.findByPk(decoded.uuid, {
        attributes: { exclude: ['password'] },
      });
      req.patient = {
        uuid: patient.uuid,
        email: patient.email,
        surname: patient.surname,
        name: patient.name,
        patronymic: patient.patronymic,
        phone: patient.phone,
        login: patient.login,
        // password: patient.password,
      };

      next(); // call next func in the middleware
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protectPatient };
