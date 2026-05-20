const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  event_date: Date,
  event_time: String,
  image: String,
  status: { type: String, default: 'upcoming' }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Event', eventSchema);
