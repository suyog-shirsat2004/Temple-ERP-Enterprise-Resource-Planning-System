const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  published_at: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('News', newsSchema);
