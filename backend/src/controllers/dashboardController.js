const { DarshanPass, Donation, RoomBooking, RestaurantOrder, User, Room, Notification } = require('../models');

const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password');

    const passes = await DarshanPass.find({ user_id: userId }).sort({ _id: -1 }).limit(5);
    const donations = await Donation.find({ user_id: userId }).sort({ _id: -1 }).limit(5);
    const bookings = await RoomBooking.find({ user_id: userId }).populate('room_id', 'room_number room_type room_name').sort({ _id: -1 }).limit(3);
    const orders = await RestaurantOrder.find({ user_id: userId }).sort({ created_at: -1 }).limit(5);

    const totalPasses = await DarshanPass.countDocuments({ user_id: userId });
    const totalDonations = await Donation.countDocuments({ user_id: userId });
    const totalBookings = await RoomBooking.countDocuments({ user_id: userId });
    const totalOrders = await RestaurantOrder.countDocuments({ user_id: userId });

    const totalDonationAmountResult = await Donation.aggregate([
      { $match: { user_id: user._id, payment_status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDonationAmount = totalDonationAmountResult[0]?.total || 0;

    const allMessages = [
      ...passes.map(p => ({ ...p.toObject(), type: 'pass', icon: 'fa-ticket-alt', icon_bg: 'primary', color: '#6366f1' })),
      ...donations.map(d => ({ ...d.toObject(), type: 'donation', icon: 'fa-donate', icon_bg: 'success', color: '#10b981' })),
      ...bookings.map(b => ({ ...b.toObject(), type: 'booking', icon: 'fa-hotel', icon_bg: 'warning', color: '#f59e0b' })),
      ...orders.map(o => ({ ...o.toObject(), type: 'restaurant', icon: 'fa-utensils', icon_bg: 'danger', color: '#ec4899' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

    const unreadCount = allMessages.filter(m => {
      const status = (m.status || m.booking_status || m.payment_status || '').toLowerCase();
      return status === 'pending' || status === '';
    }).length;

    res.json({
      success: true,
      user_data: user,
      passes, donations, bookings, orders,
      total_passes: totalPasses,
      total_donations: totalDonations,
      total_bookings: totalBookings,
      total_orders: totalOrders,
      total_donation_amount: totalDonationAmount,
      all_messages: allMessages,
      unread_count: unreadCount,
      last_logout: 'First login'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get dashboard', error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.userId }).sort({ created_at: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get notifications', error: error.message });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user_id: req.userId }, { is_read: true });
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark notifications', error: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user_id: req.userId, is_read: false });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get unread count', error: error.message });
  }
};

module.exports = { getDashboard, getNotifications, markNotificationsRead, getUnreadCount };
