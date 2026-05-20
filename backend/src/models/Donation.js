const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receipt_no: { type: String, unique: true },
  name: String,
  email: String,
  phone: String,
  amount: { type: Number, required: true },
  donation_type: { type: String, default: 'General Donation' },
  payment_method: { type: String, default: 'UPI' },
  payment_status: { type: String, default: 'completed' },
  notes: String,
  donation_date: Date
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Donation', donationSchema);
