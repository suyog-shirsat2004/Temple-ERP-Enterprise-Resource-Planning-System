const express = require('express');
const router = express.Router();
const passController = require('../controllers/passController');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/types', passController.getPassTypes);
router.get('/', auth, passController.getUserPasses);
router.get('/all', adminAuth, passController.getAllPasses);
router.get('/:id', passController.getPassById);
router.post('/', auth, upload.single('aadhar_card'), passController.createPass);
router.post('/confirm-payment', auth, passController.confirmPayment);
router.post('/:id/cancel', auth, passController.cancelPass);
router.post('/:id/approve', adminAuth, passController.approvePass);
router.post('/:id/reject', adminAuth, passController.rejectPass);
router.post('/:id/payment-paid', adminAuth, passController.markPaymentPaid);
router.put('/:id/status/:status', adminAuth, passController.updatePassStatus);
router.delete('/:id', adminAuth, passController.deletePass);
router.delete('/multiple', adminAuth, passController.deleteMultiplePasses);

module.exports = router;
