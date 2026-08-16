const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['IN_APP', 'PUSH', 'EMAIL'], default: 'IN_APP' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  sentAt: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)
