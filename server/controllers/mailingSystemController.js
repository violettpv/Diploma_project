const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const clinicEmail = process.env.EMAIL_USER;
const clinicEmailPassword = process.env.EMAIL_PASSWORD;
const clinicAppPassword = process.env.EMAIL_APP_PASSWORD;
const { Op } = require('sequelize');
const MessageTemplate = require('../models/messageTemplateModel');
const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel');
const Clinic = require('../models/clinicModel');

// @desc    Create a new message template
// @route   GET /api/mailingsystem/getappointments?date=&month=&year=
// @access  Public
const getAppointmentsByDate = asyncHandler(async (req, res) => {
  const { date, month, year } = req.query;
  if (!date && !month && !year) {
    res.status(400);
    throw new Error('Please provide a date, month or year');
  }
  if (date < 1 || date > 31) {
    res.status(400);
    throw new Error('Invalid date');
  }
  if (month < 1 || month > 12) {
    res.status(400);
    throw new Error('Invalid month');
  }
  if (year < 2000 || year > 2100) {
    res.status(400);
    throw new Error('Invalid year');
  }

  const searchDate = `${year}-${month}-${date}`;
  const appointments = await Appointment.findAll({
    where: {
      date: {
        [Op.eq]: searchDate,
      },
    },
    include: [
      {
        model: Patient,
        attributes: ['uuid', 'surname', 'name', 'patronymic', 'email'],
      },
    ],
    order: [['startTime', 'ASC']],
  });

  if (appointments) {
    res.json({
      date: searchDate,
      appointments: appointments.map((appointment) => {
        return {
          uuid: appointment.uuid,
          patient: {
            uuid: appointment.patient.uuid,
            surname: appointment.patient.surname,
            name: appointment.patient.name,
            patronymic: appointment.patient.patronymic,
            email: appointment.patient.email,
          },
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        };
      }),
    });
  } else {
    res.status(404);
    throw new Error('Appointments not found');
  }
});

// @desc    Send reminders to patients (chose on client with checkboxes)
// @route   POST /api/mailingsystem/sendreminders
// @access  Public
const sendReminders = asyncHandler(async (req, res) => {
  // const { appointments } = req.body;
  // if (!appointments) {
  //   res.status(400);
  //   throw new Error('Please provide appointments');
  // }
  // const clinic = await Clinic.findOne();
  // const reminder = await MessageTemplate.findOne({ where: { name: 'Scheduled visit' } });

  // const data = appointments.map((appointment) => {
  //   return {
  //     uuid: appointment.uuid,
  //     patient: {
  //       uuid: appointment.patient.uuid,
  //       surname: appointment.patient.surname,
  //       name: appointment.patient.name,
  //       patronymic: appointment.patient.patronymic,
  //       email: appointment.patient.email,
  //     },
  //     startTime: appointment.startTime,
  //     endTime: appointment.endTime,
  //   };
  // });

  // EMAIL_USER = brightdent.dentistry@gmail.com
  // EMAIL_PASSWORD = 2fhY@JIk1s93C0DwM@

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    auth: {
      user: 'brightdent.dentistry@gmail.com',
      pass: 'vwaq iivx oohb wgyt',
    },
  });

  let mailOptions = {
    from: 'brightdent.dentistry@gmail.com',
    to: 'poltava.violetta@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.json({ message: 'Email sent' });
      console.log('Email sent: ' + info.response);
    }
  });
});

module.exports = {
  getAppointmentsByDate,
  sendReminders,
};
