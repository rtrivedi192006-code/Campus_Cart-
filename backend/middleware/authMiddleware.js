const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token
      token = req.headers.authorization.split(' ')[1];

      // Verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user
      req.user = await User.findById(decoded.id).select('-password');

      return next(); // ✅ important: return
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        message: 'Not authorized, token failed'
      });
    }
  }

  // ❗ MUST return
  return res.status(401).json({
    message: 'Not authorized, no token'
  });
};

module.exports = { protect };