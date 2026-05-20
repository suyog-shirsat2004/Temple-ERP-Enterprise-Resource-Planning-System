const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/', auth, dashboardController.getDashboard);
router.get('/notifications', auth, dashboardController.getNotifications);
router.get('/notifications/unread', auth, dashboardController.getUnreadCount);
router.post('/notifications/read', auth, dashboardController.markNotificationsRead);

module.exports = router;
