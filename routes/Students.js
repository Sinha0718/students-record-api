// routes/students.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const mongoose = require('mongoose');

// GET /students - fetch all
router.get('/', async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// POST /students - add new
router.post('/', async (req, res, next) => {
  try {
    const { name, course, age, city } = req.body;
    // basic server-side check (helpful before mongoose error)
    if (!name || !course) {
      return res.status(400).json({ error: 'name and course are required' });
    }

    const newStudent = new Student({ name, course, age, city });
    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (err) {
    // if validation error from mongoose, send 400
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// PUT /students/:id - update
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const { name, course, age, city } = req.body;
    // optional: enforce that name and course cannot be set to empty
    if (name === '' || course === '') {
      return res.status(400).json({ error: 'name and course cannot be empty' });
    }

    const updated = await Student.findByIdAndUpdate(
      id,
      { name, course, age, city },
      { new: true, runValidators: true } // runValidators ensures schema validation on update
    );

    if (!updated) return res.status(404).json({ error: 'Student not found' });
    res.json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

// DELETE /students/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const removed = await Student.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted', student: removed });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
