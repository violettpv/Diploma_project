const asyncHandler = require('express-async-handler');
const TreatmentPlan = require('../models/treatmentPlanModel');
const TreatmentPlanRecord = require('../models/treatmentPlanRecordModel');

// може тільки doctor та main

// Check if user's role is 'main'
// const userUuid = req.user.uuid;
// const findUsersRole = await User.findOne({
//   where: { uuid: userUuid },
//   include: { model: Role, through: { attributes: [] } },
// });
// const usersRole = findUsersRole.roles[0].role;
// if (!usersRole === 'main') {
//   res.status(400);
//   throw new Error('User is not a main admin');
// }
