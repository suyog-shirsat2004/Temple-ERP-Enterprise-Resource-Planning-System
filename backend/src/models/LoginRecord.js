const mongoose = require('mongoose');

const loginRecordSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  username: { type: String, required: true },
  ip_address: String,
  user_agent: String,
  login_method: { type: String, default: 'password' },
  success: { type: Boolean, default: true },
  device_info: String
}, { timestamps: { createdAt: 'login_at' } });

loginRecordSchema.index({ user_id: 1, login_at: -1 });
loginRecordSchema.index({ login_at: -1 });

module.exports = mongoose.model('LoginRecord', loginRecordSchema);
