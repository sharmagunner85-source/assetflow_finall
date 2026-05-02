const mongoose = require('mongoose');

const penaltySchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
  equipName: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['esewa', 'paypal', null], default: null },
  dateIssued: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Penalty', penaltySchema);