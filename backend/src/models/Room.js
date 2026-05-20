const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_number: String,
  room_name: String,
  room_type: String,
  price_per_day: Number,
  status: { type: String, default: 'available' },
  amenities: String,
  description: String
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Room', roomSchema);
