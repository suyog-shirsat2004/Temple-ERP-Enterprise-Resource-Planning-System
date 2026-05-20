const mongoose = require('mongoose');

const roomBookingSchema = new mongoose.Schema({
  booking_id: { type: String, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  guest_name: String,
  phone: String,
  email: String,
  check_in: Date,
  check_out: Date,
  room_type: String,
  no_of_rooms: { type: Number, default: 1 },
  no_of_guests: Number,
  total_amount: Number,
  payment_status: { type: String, default: 'Pending' },
  booking_status: { type: String, default: 'Pending' },
  payment_method: String,
  payment_date: Date
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('RoomBooking', roomBookingSchema);
