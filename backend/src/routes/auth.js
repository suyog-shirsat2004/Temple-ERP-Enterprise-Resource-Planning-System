const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', auth, authController.changePassword);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, upload.single('profile_pic'), authController.updateProfile);
router.get('/login-history', auth, authController.getLoginHistory);

module.exports = router;
