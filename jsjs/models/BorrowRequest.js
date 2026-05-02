const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  equipName: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  borrowDate: { type: Date, default: Date.now },
  expectedReturn: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);