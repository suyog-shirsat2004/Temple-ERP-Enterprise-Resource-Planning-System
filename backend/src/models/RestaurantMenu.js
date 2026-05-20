const mongoose = require('mongoose');

const restaurantMenuSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  available: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('RestaurantMenu', restaurantMenuSchema);
