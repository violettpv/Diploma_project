const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Patient = require('../models/patientModel');
const Receipt = require('../models/receiptModel');
const Appointment = require('../models/appointmentModel');
const ReceiptService = require('../models/receiptServiceModel');
const Service = require('../models/serviceModel');
const { Op } = require('sequelize');

// @desc    Create a new appointment
// @route   POST /api/appointments/create
// @access  Public
const createAppointment = asyncHandler(async (req, res) => {
  const { patientUuid, userUuid, date, startTime, endTime, roomNumber, note } = req.body;

  if (!patientUuid || !userUuid || !date || !startTime || !endTime) {
    res.status(400);
    throw new Error('Please fill all fields');
  }
  if (startTime >= endTime) {
    res.status(400);
    throw new Error('Invalid time');
  }
  if (roomNumber < 1 || roomNumber > 1000) {
    res.status(400);
    throw new Error('Invalid room number');
  }

  const appointment = await Appointment.create({
    patientUuid,
    userUuid,
    date,
    startTime,
    endTime,
    roomNumber,
    isFinished: false,
    note,
  });
  const patient = await Patient.findByPk(patientUuid);
  const user = await User.findByPk(userUuid);

  if (appointment) {
    res.status(201).json({
      uuid: appointment.uuid,
      patientUuid: appointment.patientUuid,
      patientFullName: `${patient.surname} ${patient.name} ${patient.patronymic}`,
      userUuid: appointment.userUuid,
      userFullName: `${user.surname} ${user.name} ${user.patronymic}`,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      roomNumber: appointment.roomNumber,
      note: appointment.note,
    });
  } else {
    res.status(400);
    throw new Error('Invalid appointment data');
  }
});

// @desc    Get an appointment
// @route   GET /api/appointments/get/:uuid
// @access  Public
const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.uuid, {
    include: [
      {
        model: Receipt,
        attributes: ['uuid', 'sale', 'paymentType', 'isPaid', 'total'],
        include: [
          {
            model: Service,
            attributes: ['uuid', 'name', 'price'],
            through: { attributes: ['uuid', 'receiptUuid', 'serviceUuid', 'quantity'] },
          },
        ],
      },
    ],
  });
  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Get all appointments
// @route   GET /api/appointments/alldev
// @access  Private (for development)
const getAllAppointmentsDev = asyncHandler(async (req, res) => {
  const appointments = await Appointment.findAll({
    include: [
      {
        model: Receipt,
        attributes: ['uuid', 'sale', 'paymentType', 'isPaid', 'total'],
        include: [
          {
            model: Service,
            attributes: ['uuid', 'name', 'price'],
            through: { attributes: ['uuid', 'receiptUuid', 'serviceUuid', 'quantity'] },
          },
        ],
      },
    ],
  });
  if (appointments) {
    res.json(appointments);
  } else {
    res.status(404);
    throw new Error('Appointments not found');
  }
});

// @desc    Get all appointments by date
// @route   GET /api/appointments/all?date=&month=&year=
// @access  Public
const getAllAppointments = asyncHandler(async (req, res) => {
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
    order: [['startTime', 'ASC']],
  });

  if (appointments) {
    res.json(appointments);
  } else {
    res.status(404);
    throw new Error('Appointments not found');
  }
});

// @desc    Update an appointment
// @route   PUT /api/appointments/update/:uuid
// @access  Public
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.uuid);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const { userUuid, date, startTime, endTime, roomNumber, note } = req.body;

  appointment.set({
    userUuid,
    date,
    startTime,
    endTime,
    roomNumber,
    note,
  });
  await appointment.save();

  const user = await User.findByPk(userUuid);
  const patient = await Patient.findByPk(appointment.patientUuid);

  if (appointment) {
    res.status(200).json({
      uuid: appointment.uuid,
      patientUuid: appointment.patientUuid,
      patientFullName: `${patient.surname} ${patient.name} ${patient.patronymic}`,
      userUuid: appointment.userUuid,
      userFullName: `${user.surname} ${user.name} ${user.patronymic}`,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      roomNumber: appointment.roomNumber,
      note: appointment.note,
    });
  } else {
    res.status(400);
    throw new Error('Invalid appointment data');
  }
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/delete/:uuid
// @access  Public
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.uuid);

  if (appointment.receiptUuid !== null) {
    const receipt = await Receipt.findByPk(appointment.receiptUuid);
    if (receipt) {
      await receipt.destroy();
    }

    const receiptServices = await ReceiptService.findAll({
      where: { receiptUuid: appointment.receiptUuid },
    });
    if (receiptServices) {
      for (let i = 0; i < receiptServices.length; i++) {
        await receiptServices[i].destroy();
      }
    } else {
      res.status(404);
      throw new Error('Receipt services not found');
    }
  }

  if (appointment) {
    await appointment.destroy();
    res.json({ message: 'Appointment removed' });
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Add a receipt to an appointment
// @route   POST /api/appointments/receipt/create/:uuid
// @access  Public
const addReceipt = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.uuid);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  // if appointment already has a receipt
  if (appointment.receiptUuid !== null) {
    res.status(400);
    throw new Error('Appointment already has a receipt');
  }

  const receipt = await Receipt.create({});
  let total = 0;

  // should be one or more services; on client side, services should be an array
  const { services, sale, quantities } = req.body;
  if (!services || !quantities) {
    res.status(400);
    throw new Error('Please fill all fields');
  }
  if (sale < 0) {
    res.status(400);
    throw new Error('Invalid sale or quantity');
  }
  if (services.length !== quantities.length) {
    res.status(400);
    throw new Error('Invalid quantity data');
  }

  receipt.set({
    sale: sale || 0,
    isPaid: false,
  });
  await receipt.save();

  for (let i = 0; i < services.length; i++) {
    const serviceUuid = services[i];
    const quantity = quantities[i];

    const service = await Service.findByPk(serviceUuid);
    if (!service) {
      res.status(400);
      throw new Error('Service not found');
    }

    const price = service.price;

    const receiptService = await ReceiptService.create({
      receiptUuid: receipt.uuid,
      serviceUuid: serviceUuid,
      quantity: quantity,
    });

    if (!receiptService) {
      res.status(400);
      throw new Error('Invalid receipt service data');
    }

    total += price * quantity;
  }

  if (total < 0) {
    res.status(400);
    throw new Error('Invalid total');
  }
  if (sale !== 0) {
    // check if formula is correct
    total = total - (total * sale) / 100;
    // 2000 - (2000 * 10) / 100
    // 2000 - 200 = 1800
  }

  receipt.set({
    total,
  });
  await receipt.save();

  appointment.set({
    isFinished: true,
    receiptUuid: receipt.uuid,
  });
  await appointment.save();

  const receiptServices = await Receipt.findByPk(receipt.uuid, {
    include: [
      {
        model: Service,
        attributes: ['uuid', 'name', 'price'],
        through: { attributes: ['uuid', 'receiptUuid', 'serviceUuid', 'quantity'] },
      },
    ],
  });

  if (receipt) {
    res.status(201).json({
      uuid: receipt.uuid,
      sale: receipt.sale,
      paymentType: receipt.paymentType,
      isPaid: receipt.isPaid,
      total: receipt.total,
      receiptServices: receiptServices,
    });
  } else {
    res.status(400);
    throw new Error('Invalid receipt data');
  }
});

// @desc    Pay for a receipt of an appointment
// @route   PUT /api/appointments/pay/:uuid (of appointment)
// @access  Public
const payReceipt = asyncHandler(async (req, res) => {
  const { paymentType } = req.body;
  if (!paymentType) {
    res.status(400);
    throw new Error('Please fill all fields');
  }
  if (paymentType !== 'cash' && paymentType !== 'card') {
    res.status(400);
    throw new Error('Invalid payment type');
  }

  const appointment = await Appointment.findByPk(req.params.uuid);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const receipt = await Receipt.findByPk(appointment.receiptUuid);
  if (!receipt) {
    res.status(404);
    throw new Error('Receipt not found');
  }

  receipt.set({
    paymentType: paymentType,
    isPaid: true,
  });
  await receipt.save();

  // appointment.set({
  //   isFinished: true,
  // });
  // await appointment.save();

  if (receipt) {
    res.status(200).json({
      appointmentUuid: appointment.uuid,
      appointmentDate: appointment.date,
      isFinished: appointment.isFinished,
      receiptUuid: receipt.uuid,
      sale: receipt.sale,
      paymentType: receipt.paymentType,
      isPaid: receipt.isPaid,
      total: receipt.total,
    });
  } else {
    res.status(400);
    throw new Error('Invalid appointment or receipt data');
  }
});

// @desc    Get a receipt of an appointment
// @route   GET /api/appointments/receipt/get/:uuid
// @access  Public
const getReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findByPk(req.params.uuid, {
    include: [
      {
        model: Service,
        attributes: ['uuid', 'name', 'price'],
        through: { attributes: ['uuid', 'receiptUuid', 'serviceUuid', 'quantity'] },
      },
    ],
  });
  if (receipt) {
    res.json(receipt);
  } else {
    res.status(404);
    throw new Error('Receipt not found');
  }
});

// @desc    Update a receipt of an appointment
// @route   PUT /api/appointments/receipt/update/:uuid
// @access  Public
const updateReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findByPk(req.params.uuid);
  if (!receipt) {
    res.status(404);
    throw new Error('Receipt not found');
  }
  if (receipt.isPaid === true) {
    res.status(400);
    throw new Error('Receipt is already paid');
  }

  const { services, sale, quantities } = req.body;
  if (!services || !quantities) {
    res.status(400);
    throw new Error('Please fill all fields');
  }
  if (sale < 0) {
    res.status(400);
    throw new Error('Invalid sale or quantity');
  }
  if (services.length !== quantities.length) {
    res.status(400);
    throw new Error('Invalid quantity data');
  }

  let total = 0;

  receipt.set({
    sale: sale || 0,
    isPaid: false,
  });
  await receipt.save();

  // delete all previous ReceiptService
  const currentReceiptServices = await ReceiptService.findAll({
    where: { receiptUuid: receipt.uuid },
  });
  console.log(currentReceiptServices);
  if (!currentReceiptServices) {
    res.status(400);
    throw new Error('Invalid receipt service data');
  }
  for (let i = 0; i < currentReceiptServices.length; i++) {
    await currentReceiptServices[i].destroy();
  }

  for (let i = 0; i < services.length; i++) {
    const serviceUuid = services[i];
    const quantity = quantities[i];

    const service = await Service.findByPk(serviceUuid);
    if (!service) {
      res.status(400);
      throw new Error('Service not found');
    }

    const price = service.price;

    const receiptService = await ReceiptService.create({
      receiptUuid: receipt.uuid,
      serviceUuid: serviceUuid,
      quantity: quantity,
    });
    if (!receiptService) {
      res.status(400);
      throw new Error('Invalid receipt service data');
    }

    total += price * quantity;
    receiptService.set({ quantity: quantity });
    await receiptService.save();
  }

  if (total < 0) {
    res.status(400);
    throw new Error('Invalid total');
  }
  if (sale !== 0) {
    // check if formula is correct
    total = total - (total * sale) / 100;
    // 2000 - (2000 * 10) / 100
    // 2000 - 200 = 1800
  }

  receipt.set({
    total,
  });
  await receipt.save();

  const receiptServices = await Receipt.findByPk(receipt.uuid, {
    include: [
      {
        model: Service,
        attributes: ['uuid', 'name', 'price'],
        through: { attributes: ['uuid', 'receiptUuid', 'serviceUuid', 'quantity'] },
      },
    ],
  });

  if (receipt) {
    res.status(201).json({
      uuid: receipt.uuid,
      sale: receipt.sale,
      paymentType: receipt.paymentType,
      isPaid: receipt.isPaid,
      total: receipt.total,
      receiptServices: receiptServices,
    });
  } else {
    res.status(400);
    throw new Error('Invalid receipt data');
  }
});

// @desc    Delete a receipt of an appointment
// @route   DELETE /api/appointments/receipt/delete/:uuid
// @access  Public
const deleteReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findByPk(req.params.uuid);
  if (!receipt) {
    res.status(404);
    throw new Error('Receipt not found');
  }

  const appointment = await Appointment.findOne({
    where: { receiptUuid: receipt.uuid },
  });
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const receiptServices = await ReceiptService.findAll({
    where: { receiptUuid: receipt.uuid },
  });
  if (receiptServices) {
    for (let i = 0; i < receiptServices.length; i++) {
      await receiptServices[i].destroy();
    }
  } else {
    res.status(404);
    throw new Error('Receipt services not found');
  }

  if (receipt) {
    await receipt.destroy();
    appointment.set({
      isFinished: false,
      receiptUuid: null,
    });
    await appointment.save();
    res.json({ message: 'Receipt removed' });
  } else {
    res.status(404);
    throw new Error('Receipt not found');
  }
});

// @desc    Get all finished appointments (for statistics by dates page)
// @route   GET /api/appointments/finished?date=&month=&year=
// @access  Public
const getFinishedAppointments = asyncHandler(async (req, res) => {
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
      isFinished: true,
    },
    include: [
      {
        model: Receipt,
        attributes: ['uuid', 'sale', 'paymentType', 'isPaid', 'total'],
        where: { isPaid: true },
        include: [
          {
            model: Service,
            attributes: ['uuid', 'name', 'price'],
            through: { attributes: ['uuid', 'receiptUuid', 'serviceUuid', 'quantity'] },
          },
        ],
      },
    ],
    order: [['startTime', 'ASC']],
  });

  // count total sum of all receipts
  let totalSum = 0;
  for (let i = 0; i < appointments.length; i++) {
    totalSum += parseFloat(appointments[i].receipt.total);
  }
  // console.log(totalSum);

  if (appointments) {
    res.json({ appointments, totalSum });
  } else {
    res.status(404);
    throw new Error('Appointments not found');
  }
});

module.exports = {
  createAppointment,
  getAppointment,
  getAllAppointmentsDev,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  addReceipt,
  payReceipt,
  getReceipt,
  updateReceipt,
  deleteReceipt,
  getFinishedAppointments,
};
