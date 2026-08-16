const mongoose = require('mongoose')

const semesterSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  label: { type: String, required: true }, // e.g. "7th Semester"
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Semester', semesterSchema)
