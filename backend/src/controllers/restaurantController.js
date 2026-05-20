const { RestaurantOrder, RestaurantMenu, User } = require('../models');

const getMenu = async (req, res) => {
  try {
    const menuItems = await RestaurantMenu.find({ available: true });
    const categories = await RestaurantMenu.distinct('category', { available: true });
    res.json({ success: true, menu_items: menuItems, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get menu', error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await RestaurantOrder.find({ user_id: req.userId }).sort({ created_at: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get orders', error: error.message });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { items, payment_method, name } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const user = await User.findById(req.userId);
    const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 900 + 100);

    const order = await RestaurantOrder.create({
      user_id: req.userId,
      order_id: orderId,
      items,
      total_amount: totalAmount,
      name: name || (user ? user.name : ''),
      phone: (user && user.mobile) || '0000000000',
      order_date: new Date(),
      order_time: new Date().toTimeString().split(' ')[0],
      payment_status: 'paid',
      payment_method: payment_method || 'UPI',
      status: 'confirmed',
      payment_date: new Date()
    });

    res.status(201).json({ success: true, message: `Order placed successfully! Order ID: ${orderId}`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await RestaurantOrder.findOne({ order_id: req.params.orderId, user_id: req.userId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order, items: order.items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get order', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await RestaurantOrder.find().populate('user_id', 'name email').sort({ created_at: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get orders', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await RestaurantOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = req.body.status;
    await order.save();
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

module.exports = {
  getMenu, getUserOrders, placeOrder, getOrder, getAllOrders, updateOrderStatus
};
