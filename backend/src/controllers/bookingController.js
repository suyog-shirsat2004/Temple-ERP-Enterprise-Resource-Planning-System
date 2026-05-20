const { RoomBooking, Room, User, Notification } = require('../models');

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'available' }).sort({ price_per_day: 1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get rooms', error: error.message });
  }
};

const getAllRoomsAdmin = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ _id: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get rooms', error: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await RoomBooking.find({ user_id: req.userId }).populate('room_id').sort({ _id: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get bookings', error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await RoomBooking.find()
      .populate('user_id', 'name email mobile')
      .populate('room_id')
      .sort({ _id: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get bookings', error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await RoomBooking.findOne({ _id: req.params.id, user_id: req.userId }).populate('room_id');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get booking', error: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out, guest_name, phone, email, no_of_guests } = req.body;

    if (!room_id || !check_in || !check_out) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    const nights = Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
    if (nights < 1) return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });

    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const bookingId = 'RMB' + Date.now() + Math.floor(Math.random() * 900 + 100);
    const totalAmount = room.price_per_day * nights;

    const booking = await RoomBooking.create({
      user_id: req.userId,
      room_id,
      guest_name,
      phone,
      email,
      check_in,
      check_out,
      room_type: room.room_type,
      no_of_rooms: 1,
      no_of_guests,
      total_amount: totalAmount,
      payment_status: 'Pending',
      booking_status: 'Pending',
      booking_id: bookingId
    });

    res.status(201).json({ success: true, message: 'Booking created', booking, amount: totalAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to book room', error: error.message });
  }
};

const processPayment = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const paymentMethod = req.body.payment_method || 'UPI';

    const booking = await RoomBooking.findOne({ booking_id, user_id: req.userId });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.payment_status = 'Paid';
    booking.booking_status = 'Confirmed';
    booking.payment_method = paymentMethod;
    booking.payment_date = new Date();
    await booking.save();

    await Notification.create({
      user_id: req.userId,
      title: 'Room Booking Confirmed',
      message: `Your room booking (ID: ${booking_id}) has been confirmed.`,
      type: 'booking'
    });

    res.json({ success: true, message: 'Payment successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment failed', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findOne({ _id: req.params.id, user_id: req.userId });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.booking_status = 'Cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.booking_status = 'confirmed';
    await booking.save();

    await Notification.create({
      user_id: booking.user_id,
      title: 'Booking Confirmed',
      message: `Your room booking has been confirmed! Booking Code: ${booking.booking_id}`,
      type: 'booking'
    });

    res.json({ success: true, message: 'Booking confirmed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to confirm booking', error: error.message });
  }
};

const cancelBookingAdmin = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.booking_status = 'cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { room_number, room_name, room_type, price_per_day, description, amenities } = req.body;
    const room = await Room.create({ room_number, room_name, room_type, price_per_day, description, amenities, status: 'available' });
    res.status(201).json({ success: true, message: 'Room added successfully', room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add room', error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const { room_number, room_name, room_type, price_per_day, description, amenities, status } = req.body;
    if (room_number) room.room_number = room_number;
    if (room_name) room.room_name = room_name;
    if (room_type) room.room_type = room_type;
    if (price_per_day) room.price_per_day = price_per_day;
    if (description) room.description = description;
    if (amenities) room.amenities = amenities;
    if (status) room.status = status;

    await room.save();
    res.json({ success: true, message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update room', error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const result = await Room.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ success: true, message: 'Room deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete room', error: error.message });
  }
};

module.exports = {
  getAllRooms, getAllRoomsAdmin, getUserBookings, getAllBookings, getBookingById,
  createBooking, processPayment, cancelBooking, confirmBooking, cancelBookingAdmin,
  createRoom, updateRoom, deleteRoom
};
