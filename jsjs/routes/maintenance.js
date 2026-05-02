const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Equipment = require('../models/Equipment');
const { protect, techOrAdmin } = require('../middleware/auth');

// GET /api/maintenance
router.get('/', protect, async (req, res) => {
  const tasks = await Maintenance.find();
  res.json(tasks);
});

// POST /api/maintenance — report damage (user)
router.post('/', protect, async (req, res) => {
  try {
    const { equipmentId, issue } = req.body;
    const eq = await Equipment.findById(equipmentId);
    if (!eq) return res.status(404).json({ message: 'Equipment not found' });

    eq.status = 'maintenance';
    await eq.save();

    const task = await Maintenance.create({
      equipment: equipmentId,
      equipName: eq.name,
      issue,
      reportedBy: req.user._id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/maintenance/:id — technician updates status
router.patch('/:id', protect, techOrAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Maintenance.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (status === 'completed') {
      await Equipment.findByIdAndUpdate(task.equipment, { status: 'available' });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;