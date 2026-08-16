const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  description: { type: String },
  hodName: { type: String },
  email: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Department', departmentSchema)
