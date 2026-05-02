const express = require('express');
const router = express.Router();
const BorrowRequest = require('../models/BorrowRequest');
const ActiveBorrow = require('../models/ActiveBorrow');
const Equipment = require('../models/Equipment');
const Penalty = require('../models/Penalty');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/borrow/request — user requests borrow
router.post('/request', protect, async (req, res) => {
  try {
    const { equipmentId } = req.body;
    const eq = await Equipment.findById(equipmentId);
    if (!eq || eq.status !== 'available')
      return res.status(400).json({ message: 'Equipment not available' });

    const request = await BorrowRequest.create({
      equipment: equipmentId,
      equipName: eq.name,
      user: req.user._id,
      userName: req.user.name,
      expectedReturn: new Date(Date.now() + 7 * 86400000)
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/borrow/requests — admin gets all pending
router.get('/requests', protect, adminOnly, async (req, res) => {
  const requests = await BorrowRequest.find({ status: 'pending' });
  res.json(requests);
});

// GET /api/borrow/active — get active borrows (user gets own, admin gets all)
router.get('/active', protect, async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const borrows = await ActiveBorrow.find({ ...filter, returned: false });
  res.json(borrows);
});

// PATCH /api/borrow/requests/:id — admin approve/reject
router.patch('/requests/:id', protect, adminOnly, async (req, res) => {
  try {
    const { approve } = req.body;
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (approve) {
      const eq = await Equipment.findById(request.equipment);
      if (!eq || eq.status !== 'available')
        return res.status(400).json({ message: 'Equipment not available' });

      eq.status = 'borrowed';
      await eq.save();

      await ActiveBorrow.create({
        equipment: request.equipment,
        equipName: request.equipName,
        user: request.user,
        userName: request.userName,
        borrowDate: request.borrowDate,
        dueDate: request.expectedReturn
      });
      request.status = 'approved';
    } else {
      request.status = 'rejected';
    }
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/borrow/return/:borrowId — user returns item
router.post('/return/:borrowId', protect, async (req, res) => {
  try {
    const borrow = await ActiveBorrow.findById(req.params.borrowId);
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });

    const eq = await Equipment.findById(borrow.equipment);
    const today = new Date();
    const due = new Date(borrow.dueDate);

    if (today > due && !borrow.penaltyApplied) {
      const daysLate = Math.ceil((today - due) / (1000 * 3600 * 24));
      const penaltyAmount = daysLate * (eq?.dailyPenaltyRate || 5);
      await Penalty.create({
        equipment: borrow.equipment,
        equipName: borrow.equipName,
        user: borrow.user,
        userName: borrow.userName,
        amount: penaltyAmount,
        reason: `Late return (${daysLate} days overdue)`
      });
      borrow.penaltyApplied = true;
    }

    borrow.returned = true;
    await borrow.save();

    if (eq) { eq.status = 'available'; await eq.save(); }
    res.json({ message: 'Item returned successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;