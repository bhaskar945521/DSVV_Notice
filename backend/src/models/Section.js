const mongoose = require('mongoose')

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Section A"
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  capacity: { type: Number, default: 60 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Section', sectionSchema)
