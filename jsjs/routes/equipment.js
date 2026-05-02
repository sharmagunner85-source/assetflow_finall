const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/equipment — all equipment
router.get('/', protect, async (req, res) => {
  const equipment = await Equipment.find();
  res.json(equipment);
});

// POST /api/equipment — add (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const eq = await Equipment.create(req.body);
    res.status(201).json(eq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/equipment/:id — remove (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Equipment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Equipment removed' });
});

// PATCH /api/equipment/:id/status — update status
router.patch('/:id/status', protect, async (req, res) => {
  const eq = await Equipment.findByIdAndUpdate(
    req.params.id, { status: req.body.status }, { new: true }
  );
  res.json(eq);
});

module.exports = router;