const jwt = require('jsonwebtoken');
const { User, LoginRecord } = require('../models');

const parseDeviceInfo = (userAgent) => {
  if (!userAgent) return 'Unknown';
  const info = [];
  if (/windows/i.test(userAgent)) info.push('Windows');
  else if (/macintosh|mac os x/i.test(userAgent)) info.push('macOS');
  else if (/linux/i.test(userAgent)) info.push('Linux');
  if (/chrome/i.test(userAgent)) info.push('Chrome');
  else if (/firefox/i.test(userAgent)) info.push('Firefox');
  else if (/safari/i.test(userAgent)) info.push('Safari');
  else if (/edge/i.test(userAgent)) info.push('Edge');
  return info.length > 0 ? info.join(', ') : userAgent.substring(0, 50);
};

const register = async (req, res) => {
  try {
    const { password, password2, first_name, last_name, username, email } = req.body;

    if (password !== password2) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (!first_name || !last_name) {
      return res.status(400).json({ success: false, message: 'First and Last Name are required' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name: `${first_name} ${last_name}`,
      username,
      email,
      password
    });

    res.status(201).json({ success: true, message: 'Registration successful', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password, remember } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please enter username and password' });
    }

    const user = await User.findOne({ $or: [{ email: username }, { username }] });

    if (!user) {
      await LoginRecord.create({
        user_id: null,
        username,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        login_method: 'password',
        success: false
      });
      return res.status(401).json({ success: false, message: 'User not found. Please register first.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await LoginRecord.create({
        user_id: user._id,
        username: user.username || user.email,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        login_method: 'password',
        success: false
      });
      return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
    }

    await LoginRecord.create({
      user_id: user._id,
      username: user.username || user.email,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      login_method: 'password',
      success: true,
      device_info: parseDeviceInfo(req.headers['user-agent'])
    });

    const expiresIn = remember ? '30d' : process.env.JWT_EXPIRE;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, profile_pic: user.profile_pic }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === 'suyogshirsat2004@gmail.com' && password === 'suyog2004') {
      await LoginRecord.create({
        user_id: null,
        username: 'admin',
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        login_method: 'admin',
        success: true,
        device_info: parseDeviceInfo(req.headers['user-agent'])
      });
      const token = jwt.sign({ id: 'admin', isAdmin: true }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
      return res.json({ success: true, message: 'Admin login successful', token, user: { id: 'admin', name: 'Admin', role: 'admin' } });
    }

    await LoginRecord.create({
      user_id: null,
      username: username || 'unknown',
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      login_method: 'admin',
      success: false
    });
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Admin login failed', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, new_password, confirm_password } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    if (new_password !== confirm_password) return res.status(400).json({ success: false, message: 'Passwords do not match' });
    if (new_password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Email not found' });

    user.password = new_password;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = new_password;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    if (req.isAdmin || req.userId === 'admin') {
      return res.json({ success: true, user: { id: 'admin', name: 'Admin', role: 'admin', email: 'admin@temple.com' } });
    }
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get profile', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, mobile, address } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;
    if (address !== undefined) user.address = address;

    if (req.file) {
      user.profile_pic = req.file.filename;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

const getLoginHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.userId !== 'admin' && !req.isAdmin) {
      query.user_id = req.userId;
    }

    const records = await LoginRecord.find(query)
      .sort({ login_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'name email');

    const total = await LoginRecord.countDocuments(query);

    res.json({
      success: true,
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch login history', error: error.message });
  }
};

module.exports = { register, login, adminLogin, resetPassword, changePassword, getProfile, updateProfile, getLoginHistory };
