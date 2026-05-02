const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['available', 'borrowed', 'maintenance'], default: 'available' },
  location: { type: String, required: true },
  dailyPenaltyRate: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);