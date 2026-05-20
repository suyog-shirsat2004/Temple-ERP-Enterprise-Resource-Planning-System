const mongoose = require('mongoose');

const passTypeSchema = new mongoose.Schema({
  pass_type: String,
  price: { type: Number, default: 0 },
  description: String,
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('PassType', passTypeSchema);
