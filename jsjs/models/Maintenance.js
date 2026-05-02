const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  equipName: String,
  issue: { type: String, required: true },
  status: { type: String, enum: ['reported', 'in-progress', 'completed'], default: 'reported' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTech: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);