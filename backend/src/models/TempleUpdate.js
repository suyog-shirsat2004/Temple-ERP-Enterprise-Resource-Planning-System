const mongoose = require('mongoose');

const templeUpdateSchema = new mongoose.Schema({
  title: String,
  description: String,
  short_description: String,
  update_type: String,
  event_date: Date,
  event_end_date: Date,
  image: String,
  is_featured: { type: Boolean, default: false },
  status: { type: String, default: 'active' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('TempleUpdate', templeUpdateSchema);
