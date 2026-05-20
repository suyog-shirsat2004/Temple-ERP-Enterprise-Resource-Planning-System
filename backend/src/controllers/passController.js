const { DarshanPass, User, PassType, Notification } = require('../models');

const getAllPasses = async (req, res) => {
  try {
    const passes = await DarshanPass.find().populate('user_id', 'name email mobile').sort({ _id: -1 });
    res.json({ success: true, passes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get passes', error: error.message });
  }
};

const getUserPasses = async (req, res) => {
  try {
    const passes = await DarshanPass.find({ user_id: req.userId }).sort({ _id: -1 });
    res.json({ success: true, passes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get passes', error: error.message });
  }
};

const getPassById = async (req, res) => {
  try {
    const pass = await DarshanPass.findOne({ pass_id: req.params.id }).populate('user_id', 'name email profile_pic');
    if (!pass) return res.status(404).json({ success: false, message: 'Pass not found' });

    res.json({ success: true, pass });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get pass', error: error.message });
  }
};

const createPass = async (req, res) => {
  try {
    const { pass_type, payment_method, devotee_name, phone, email, gender, address, visit_date, visit_time, no_of_persons, transaction_id, aadhar_number } = req.body;

    let passTypeData = await PassType.findOne({ pass_type: { $regex: new RegExp(pass_type, 'i') }, is_active: true });
    if (!passTypeData) {
      passTypeData = await PassType.findOne({ pass_type: { $regex: new RegExp(pass_type.replace(/_/g, ' '), 'i') }, is_active: true });
    }

    let amount = passTypeData ? passTypeData.price : 0;
    if (!amount) {
      const fallback = { general: 50, special: 100, vip: 500 };
      amount = fallback[pass_type] || 0;
    }
    const passTypeName = passTypeData ? passTypeData.pass_type : pass_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const persons = parseInt(no_of_persons) || 1;
    const totalAmount = amount * persons;

    const passId = 'DSP' + Date.now() + Math.floor(Math.random() * 900 + 100);
    const paymentStatus = payment_method === 'upi' ? 'paid' : 'pending';

    const pass = await DarshanPass.create({
      pass_id: passId,
      user_id: req.userId,
      devotee_name,
      phone,
      email,
      gender,
      address,
      visit_date,
      visit_time,
      no_of_persons: persons,
      pass_type: passTypeName,
      amount,
      total_amount: totalAmount,
      payment_method,
      transaction_id: transaction_id || '',
      aadhar_number: aadhar_number || '',
      aadhar_card: req.file ? req.file.filename : '',
      status: 'pending',
      payment_status: paymentStatus
    });

    await Notification.create({
      user_id: req.userId,
      title: 'New Pass Request',
      message: `New Darshan Pass request from ${devotee_name} for ${passTypeName}`,
      type: 'pass'
    });

    res.status(201).json({ success: true, message: `Darshan Pass request submitted! Pass ID: ${passId}`, pass });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate pass', error: error.message });
  }
};

const cancelPass = async (req, res) => {
  try {
    const pass = await DarshanPass.findOne({ _id: req.params.id, user_id: req.userId });
    if (!pass) return res.status(404).json({ success: false, message: 'Pass not found' });

    pass.status = 'cancelled';
    await pass.save();
    res.json({ success: true, message: 'Pass cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel pass', error: error.message });
  }
};

const approvePass = async (req, res) => {
  try {
    const pass = await DarshanPass.findById(req.params.id);
    if (!pass) return res.status(404).json({ success: false, message: 'Pass not found' });

    pass.status = 'approved';
    pass.payment_status = 'paid';
    pass.payment_date = new Date();
    await pass.save();

    await Notification.create({
      user_id: pass.user_id,
      title: 'Pass Approved',
      message: `Your Darshan Pass (${pass.pass_id}) has been APPROVED!`,
      type: 'pass'
    });

    res.json({ success: true, message: 'Pass approved successfully', pass });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve pass', error: error.message });
  }
};

const rejectPass = async (req, res) => {
  try {
    const pass = await DarshanPass.findById(req.params.id);
    if (!pass) return res.status(404).json({ success: false, message: 'Pass not found' });

    pass.status = 'rejected';
    await pass.save();

    await Notification.create({
      user_id: pass.user_id,
      title: 'Pass Rejected',
      message: 'Your Darshan Pass request has been rejected.',
      type: 'pass'
    });

    res.json({ success: true, message: 'Pass rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject pass', error: error.message });
  }
};

const updatePassStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    const pass = await DarshanPass.findById(id);
    if (!pass) return res.status(404).json({ success: false, message: 'Pass not found' });

    if (status === 'active' || status === 'confirmed') {
      pass.status = 'active';
      pass.payment_status = 'paid';
      pass.payment_date = new Date();
    } else {
      pass.status = status;
    }
    await pass.save();

    res.json({ success: true, message: 'Pass status updated', pass });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update pass status', error: error.message });
  }
};

const markPaymentPaid = async (req, res) => {
  try {
    const pass = await DarshanPass.findById(req.params.id);
    if (!pass) return res.status(404).json({ success: false, message: 'Pass not found' });

    pass.payment_status = 'paid';
    pass.payment_date = new Date();
    await pass.save();
    res.json({ success: true, message: `Payment marked as received for pass: ${pass.pass_id}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update payment status', error: error.message });
  }
};

const deletePass = async (req, res) => {
  try {
    const result = await DarshanPass.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ success: true, message: 'Pass deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Pass not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete pass', error: error.message });
  }
};

const deleteMultiplePasses = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) return res.status(400).json({ success: false, message: 'No passes selected' });

    const result = await DarshanPass.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${result.deletedCount} passes deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete passes', error: error.message });
  }
};

const getPassTypes = async (req, res) => {
  try {
    const passTypes = await PassType.find({ is_active: true }).sort({ price: 1 });
    res.json({ success: true, passTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get pass types', error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { pass_id } = req.body;
    const pass = await DarshanPass.findOne({ pass_id });

    if (!pass) return res.status(404).json({ success: false, message: 'Pass not found' });
    if (pass.payment_status === 'paid') {
      return res.json({ success: true, already_paid: true, message: 'Payment already confirmed' });
    }

    pass.payment_status = 'paid';
    pass.payment_date = new Date();
    await pass.save();

    res.json({ success: true, message: 'Payment Successful', transaction_id: 'TXN' + Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment confirmation failed', error: error.message });
  }
};

module.exports = {
  getAllPasses, getUserPasses, getPassById, createPass, cancelPass,
  approvePass, rejectPass, updatePassStatus, markPaymentPaid,
  deletePass, deleteMultiplePasses, getPassTypes, confirmPayment
};
