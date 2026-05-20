const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.isAdmin) {
      req.user = { id: 'admin', name: 'Admin', role: 'admin', email: 'admin@temple.com' };
      req.userId = 'admin';
      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user || user.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.isAdmin) {
      req.user = { id: 'admin', name: 'Admin', role: 'admin' };
      req.userId = 'admin';
      req.isAdmin = true;
      return next();
    }
    const user = await User.findById(decoded.id);
    if (!user || user.status !== 'active' || user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid admin token' });
    }
    req.user = user;
    req.userId = user.id;
    req.isAdmin = true;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.isAdmin) {
        req.user = { id: 'admin', name: 'Admin', role: 'admin', email: 'admin@temple.com' };
        req.userId = 'admin';
        req.isAdmin = true;
      } else {
        const user = await User.findById(decoded.id);
        if (user && user.status === 'active') {
          req.user = user;
          req.userId = user.id;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { auth, adminAuth, optionalAuth };
