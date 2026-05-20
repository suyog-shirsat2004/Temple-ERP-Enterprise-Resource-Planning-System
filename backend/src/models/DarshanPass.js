const mongoose = require('mongoose');

const darshanPassSchema = new mongoose.Schema({
  pass_id: { type: String, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  devotee_name: { type: String, required: true },
  phone: String,
  email: String,
  gender: String,
  address: String,
  visit_date: Date,
  visit_time: String,
  no_of_persons: { type: Number, default: 1 },
  pass_type: String,
  amount: { type: Number, default: 0 },
  total_amount: { type: Number, default: 0 },
  payment_method: String,
  transaction_id: String,
  payment_status: { type: String, default: 'pending' },
  payment_date: Date,
  status: { type: String, default: 'pending' },
  aadhar_number: String,
  aadhar_card: String,
  special_requests: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('DarshanPass', darshanPassSchema);
