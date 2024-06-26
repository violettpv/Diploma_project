const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Role = require('../models/roleModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const user = await User.findByPk(decoded.uuid, {
        attributes: { exclude: ['password'] },
        include: { model: Role, attributes: ['role'], through: { attributes: [] } },
      });
      req.user = {
        uuid: user.uuid,
        email: user.email,
        surname: user.surname,
        name: user.name,
        patronymic: user.patronymic,
        phone: user.phone,
        role: user.roles[0].role,
        token: token,
        // roles: user.roles.map((obj) => obj.role),
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

module.exports = { protect };
