const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/rooms', bookingController.getAllRooms);
router.get('/rooms/all', adminAuth, bookingController.getAllRoomsAdmin);
router.post('/rooms', adminAuth, bookingController.createRoom);
router.put('/rooms/:id', adminAuth, bookingController.updateRoom);
router.delete('/rooms/:id', adminAuth, bookingController.deleteRoom);

router.get('/', auth, bookingController.getUserBookings);
router.get('/all', adminAuth, bookingController.getAllBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.post('/', auth, bookingController.createBooking);
router.post('/payment', auth, bookingController.processPayment);
router.post('/:id/cancel', auth, bookingController.cancelBooking);
router.post('/:id/confirm', adminAuth, bookingController.confirmBooking);
router.post('/:id/cancel-admin', adminAuth, bookingController.cancelBookingAdmin);

module.exports = router;
