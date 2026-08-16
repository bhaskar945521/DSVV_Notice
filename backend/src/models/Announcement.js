const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
  text: { type: String, required: true },
  link: { type: String },
  isActive: { type: Boolean, default: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  expiresAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = mongoose.model('Announcement', announcementSchema)
