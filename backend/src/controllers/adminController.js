const { User, DarshanPass, Donation, RoomBooking, RestaurantOrder, Room, Notification } = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPasses = await DarshanPass.countDocuments();
    const totalBookings = await RoomBooking.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const totalRestaurantOrders = await RestaurantOrder.countDocuments();

    const pendingPasses = await DarshanPass.countDocuments({ status: 'pending' });
    const pendingBookings = await RoomBooking.countDocuments({ booking_status: 'Pending' });
    const pendingRestaurant = await RestaurantOrder.countDocuments({ status: 'pending' });
    const pendingDonations = await Donation.countDocuments({ payment_status: { $regex: /pending/i } });

    const restaurantRevenueResult = await RestaurantOrder.aggregate([
      { $match: { payment_status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } }
    ]);
    const restaurantRevenue = restaurantRevenueResult[0]?.total || 0;

    const donationsAmountResult = await Donation.aggregate([
      { $match: { payment_status: { $in: ['completed', 'Success', 'success', 'paid'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const donationsAmount = donationsAmountResult[0]?.total || 0;

    const recentPasses = await DarshanPass.find().populate('user_id', 'name').sort({ _id: -1 }).limit(5);
    const recentBookings = await RoomBooking.find().populate('user_id', 'name').populate('room_id', 'room_number').sort({ _id: -1 }).limit(5);
    const recentDonations = await Donation.find().populate('user_id', 'name').sort({ _id: -1 }).limit(5);
    const recentOrders = await RestaurantOrder.find().sort({ created_at: -1 }).limit(5);

    const monthlyDonations = await Donation.aggregate([
      { $match: { payment_status: { $in: ['completed', 'Success', 'success', 'paid'] } } },
      { $group: { _id: { $month: '$created_at' }, total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        total_visitors: totalUsers,
        total_passes: totalPasses,
        total_bookings: totalBookings,
        total_donations: totalDonations,
        total_donations_amount: donationsAmount,
        total_restaurant_orders: totalRestaurantOrders,
        pending_passes: pendingPasses,
        pending_bookings: pendingBookings,
        pending_donations: pendingDonations,
        pending_restaurant_orders: pendingRestaurant,
        total_pending: pendingPasses + pendingBookings + pendingRestaurant + pendingDonations,
        restaurant_revenue: restaurantRevenue
      },
      recent_passes: recentPasses,
      recent_bookings: recentBookings,
      recent_donations: recentDonations,
      recent_orders: recentOrders,
      monthly_donations: monthlyDonations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get dashboard stats', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ _id: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get users', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, username, email, password, mobile } = req.body;
    const user = await User.create({ name, username, email, password, mobile });
    res.status(201).json({ success: true, message: 'User added successfully', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, mobile, status, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;
    if (status) user.status = status;
    if (password) user.password = password;

    await user.save();
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

const getDevotees = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ _id: -1 });

    const devotees = await Promise.all(users.map(async (user) => {
      const totalPasses = await DarshanPass.countDocuments({ user_id: user._id });
      const totalSpentResult = await DarshanPass.aggregate([
        { $match: { user_id: user._id, payment_status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      return { ...user.toJSON(), total_passes: totalPasses, total_spent: totalSpentResult[0]?.total || 0 };
    }));

    res.json({ success: true, devotees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get devotees', error: error.message });
  }
};

const getDevoteeDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const passes = await DarshanPass.find({ user_id: user._id }).sort({ _id: -1 });
    const bookings = await RoomBooking.find({ user_id: user._id }).sort({ _id: -1 });
    const donations = await Donation.find({ user_id: user._id }).sort({ _id: -1 });
    const orders = await RestaurantOrder.find({ user_id: user._id }).sort({ _id: -1 });

    let totalSpent = 0;
    passes.forEach(p => totalSpent += (p.total_amount || p.amount || 0));
    bookings.forEach(b => totalSpent += (b.total_amount || 0));
    donations.forEach(d => totalSpent += (d.amount || 0));

    res.json({ success: true, user, passes, bookings, donations, orders, total_spent: totalSpent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get devotee details', error: error.message });
  }
};

module.exports = {
  getDashboardStats, getAllUsers, createUser, updateUser, deleteUser,
  getDevotees, getDevoteeDetails
};
