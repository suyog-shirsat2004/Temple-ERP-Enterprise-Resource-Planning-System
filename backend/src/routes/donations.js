const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', auth, donationController.getUserDonations);
router.get('/all', adminAuth, donationController.getAllDonations);
router.get('/total', donationController.getTotalDonations);
router.get('/receipt/:receiptNo', auth, donationController.getDonationReceipt);
router.post('/', auth, donationController.createDonation);
router.post('/:id/complete', adminAuth, donationController.completeDonation);

module.exports = router;
