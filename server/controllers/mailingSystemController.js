const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const MessageTemplate = require('../models/messageTemplateModel');
const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel');
const Clinic = require('../models/clinicModel');
const EMAIL = process.env.EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;

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
      currentDate: searchDate,
      appointments: appointments.map((appointment) => {
        return {
          uuid: appointment.uuid,
          date: appointment.date,
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
  const { appointments } = req.body;
  if (!appointments) {
    res.status(400);
    throw new Error('Please provide appointments');
  }
  // console.log('appointments:', appointments);

  const clinic = await Clinic.findOne();
  // const clinicEmail = clinic.email;
  // const clinicAppPassword = clinic.appPassword;
  // const reminder = await MessageTemplate.findOne({ where: { name: 'Scheduled visit' } });
  const reminder = await MessageTemplate.findByPk('6d5c51a9-49c6-4510-8de3-afa55dc8ee8f');

  const data = appointments.map((appointment) => {
    return {
      uuid: appointment.uuid,
      patient: {
        uuid: appointment.patient.uuid,
        surname: appointment.patient.surname,
        name: appointment.patient.name,
        patronymic: appointment.patient.patronymic,
        email: appointment.patient.email,
      },
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    };
  });
  // console.log('data:', data);

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    auth: {
      user: EMAIL,
      pass: APP_PASSWORD,
    },
  });

  const filteredData = data.filter(
    (appointment) =>
      appointment.patient.email !== null && appointment.patient.email !== ''
  );

  for (const appointment of filteredData) {
    // if (appointment.patient.email === null || appointment.patient.email === '') {
    //   console.log(
    //     `Patient ${appointment.patient.surname} ${appointment.patient.name} ${appointment.patient.patronymic} has no email`
    //   );
    //   continue;
    // }

    let date = appointment.date;
    let time = appointment.startTime;
    let clinicName = clinic.name;
    let clinicAddress = clinic.address;
    let clinicPhone = clinic.phone;

    const reminderBody = reminder.body
      .replace('{date}', date)
      .replace('{time}', time)
      .replace('{clinicAddress}', clinicAddress)
      .replace('{clinicName}', clinicName)
      .replace('{clinicPhone}', clinicPhone);

    let mailOptions = {
      from: EMAIL,
      to: appointment.patient.email,
      subject: 'У Вас є запланований візит до BrightDent',
      text: reminderBody,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      res.json({ message: 'Emails sent' });
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
});

// @desc    Create a custom message
// @route   POST /api/mailingsystem/createmsg
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
  const { patients, subject, body } = req.body;
  if (!patients || !subject || !body) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  const clinic = await Clinic.findOne();
  const patientsData = await Patient.findAll({
    where: {
      uuid: {
        [Op.in]: patients,
      },
    },
  });

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: clinic.email,
      pass: clinic.appPassword,
    },
  });

  for (const patient of patientsData) {
    if (patient.email === null || patient.email === '') {
      console.log(
        `Patient ${patient.surname} ${patient.name} ${patient.patronymic} has no email`
      );
      continue;
    }

    let mailOptions = {
      from: clinic.email,
      to: patient.email,
      subject: subject,
      text: body,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  res.json({ message: 'Emails sent' });
});

// @desc    Send message using a template
// @route   POST /api/mailingsystem/sendmsg
// @access  Public
const sendMessage = asyncHandler(async (req, res) => {
  const { patients, subject, templateUuid } = req.body;
  if (!patients || !subject || !templateUuid) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  const clinic = await Clinic.findOne();
  const template = await MessageTemplate.findByPk(templateUuid);
  const patientsData = await Patient.findAll({
    where: {
      uuid: {
        [Op.in]: patients,
      },
    },
  });

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: clinic.email,
      pass: clinic.appPassword,
    },
  });

  for (const patient of patientsData) {
    if (patient.email === null || patient.email === '') {
      console.log(
        `Patient ${patient.surname} ${patient.name} ${patient.patronymic} has no email`
      );
      continue;
    }

    let mailOptions = {
      from: clinic.email,
      to: patient.email,
      subject: subject,
      text: template.body,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  res.json({ message: 'Emails sent' });
});

// @desc    Get patients who have birthdays today
// @route   GET /api/mailingsystem/getbirthdays
// @access  Public
const getBirthdays = asyncHandler(async (req, res) => {
  // to send greeting use sendMessage method
  // send array of uuids of patients who have birthdays today
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();

  const patients = await Patient.findAll({
    where: {
      birthdate: {
        [Op.endsWith]: `${month.toString()}-${day.toString()}`,
      },
    },
  });

  if (patients) {
    res.json({
      currentDate: `${year}-${month}-${day}`,
      patients: patients.map((patient) => {
        return {
          uuid: patient.uuid,
          surname: patient.surname,
          name: patient.name,
          patronymic: patient.patronymic,
          email: patient.email,
          birthdate: patient.birthdate,
        };
      }),
    });
  } else {
    res.status(404);
    throw new Error('Patients not found');
  }
});

module.exports = {
  getAppointmentsByDate,
  sendReminders,
  createMessage,
  sendMessage,
  getBirthdays,
};
