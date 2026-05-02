const express = require('express');
const router = express.Router();
const Penalty = require('../models/Penalty');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/penalties — user gets own, admin gets all
router.get('/', protect, async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const penalties = await Penalty.find(filter);
  res.json(penalties);
});

// POST /api/penalties — admin issues penalty
router.post('/', protect, adminOnly, async (req, res) => {
  const penalty = await Penalty.create(req.body);
  res.status(201).json(penalty);
});

// PATCH /api/penalties/:id/pay — user pays penalty
router.patch('/:id/pay', protect, async (req, res) => {
  const { paymentMethod } = req.body; // 'esewa' or 'paypal'
  const penalty = await Penalty.findByIdAndUpdate(
    req.params.id,
    { status: 'paid', paymentMethod },
    { new: true }
  );
  res.json(penalty);
});

// PATCH /api/penalties/:id/mark-paid — admin marks paid manually
router.patch('/:id/mark-paid', protect, adminOnly, async (req, res) => {
  const penalty = await Penalty.findByIdAndUpdate(
    req.params.id, { status: 'paid' }, { new: true }
  );
  res.json(penalty);
});

module.exports = router;