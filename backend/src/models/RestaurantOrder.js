const mongoose = require('mongoose');

const restaurantOrderSchema = new mongoose.Schema({
  order_id: { type: String, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    name: String,
    price: Number,
    qty: Number
  }],
  total_amount: Number,
  name: String,
  phone: String,
  order_date: Date,
  order_time: String,
  payment_status: { type: String, default: 'paid' },
  payment_method: { type: String, default: 'UPI' },
  status: { type: String, default: 'confirmed' },
  payment_date: Date
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('RestaurantOrder', restaurantOrderSchema);
