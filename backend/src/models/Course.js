const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, uppercase: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  level: { type: String, enum: ['UG', 'PG', 'Diploma', 'PhD'], default: 'UG' },
  durationYears: { type: Number, default: 3 },
  totalSemesters: { type: Number, default: 6 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)
