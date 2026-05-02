const mongoose = require('mongoose');

const activeBorrowSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  equipName: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returned: { type: Boolean, default: false },
  penaltyApplied: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ActiveBorrow', activeBorrowSchema);