const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, adminController.getDashboardStats);
router.get('/users', adminAuth, adminController.getAllUsers);
router.post('/users', adminAuth, adminController.createUser);
router.put('/users/:id', adminAuth, adminController.updateUser);
router.delete('/users/:id', adminAuth, adminController.deleteUser);
router.get('/devotees', adminAuth, adminController.getDevotees);
router.get('/devotees/:id', adminAuth, adminController.getDevoteeDetails);

module.exports = router;
