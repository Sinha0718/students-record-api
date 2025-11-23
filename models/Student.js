// models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    min: 0
  },
  city: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
