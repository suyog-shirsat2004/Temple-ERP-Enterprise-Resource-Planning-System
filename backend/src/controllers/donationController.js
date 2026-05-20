const { Donation, User } = require('../models');

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate('user_id', 'name email').sort({ _id: -1 });
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get donations', error: error.message });
  }
};

const getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user_id: req.userId }).sort({ _id: -1 });
    const total = donations
      .filter(d => ['completed', 'Success', 'success', 'paid'].includes(d.payment_status))
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    res.json({ success: true, donations, total_donated: total });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get donations', error: error.message });
  }
};

const createDonation = async (req, res) => {
  try {
    const { amount, name, email, phone, donation_type, payment_method, message: notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid donation amount' });
    }

    const user = await User.findById(req.userId);
    const receiptNo = 'DON' + Date.now() + Math.floor(Math.random() * 9000 + 1000);

    const donation = await Donation.create({
      user_id: req.userId,
      receipt_no: receiptNo,
      name: name || (user ? user.name : ''),
      email,
      phone,
      amount,
      donation_type: donation_type || 'General Donation',
      payment_method: payment_method || 'UPI',
      payment_status: 'completed',
      notes,
      donation_date: new Date()
    });

    res.status(201).json({ success: true, message: `Thank you for your donation! Receipt No: ${receiptNo}`, donation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process donation', error: error.message });
  }
};

const getDonationReceipt = async (req, res) => {
  try {
    const donation = await Donation.findOne({ receipt_no: req.params.receiptNo });
    if (!donation) return res.status(404).json({ success: false, message: 'Donation receipt not found' });
    res.json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get receipt', error: error.message });
  }
};

const completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });

    donation.payment_status = 'completed';
    await donation.save();
    res.json({ success: true, message: 'Donation marked as completed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update donation', error: error.message });
  }
};

const getTotalDonations = async (req, res) => {
  try {
    const result = await Donation.aggregate([
      { $match: { payment_status: { $in: ['completed', 'Success', 'success', 'paid'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ success: true, total: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get total', error: error.message });
  }
};

module.exports = {
  getAllDonations, getUserDonations, createDonation, getDonationReceipt,
  completeDonation, getTotalDonations
};
