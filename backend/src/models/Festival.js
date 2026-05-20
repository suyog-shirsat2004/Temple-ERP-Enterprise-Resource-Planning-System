const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
  name: String,
  description: String,
  event_date: Date,
  event_time: String,
  image: String,
  status: { type: String, default: 'active' }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Festival', festivalSchema);
