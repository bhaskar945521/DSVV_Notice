const mongoose = require('mongoose')

const noticeViewSchema = new mongoose.Schema({
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: {
    type: String,
    enum: ['VIEWED', 'OPENED', 'SUMMARIZED', 'DOWNLOADED', 'SAVED'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: false })

noticeViewSchema.index({ noticeId: 1, studentId: 1, action: 1 }, { unique: true })
noticeViewSchema.index({ noticeId: 1 })
noticeViewSchema.index({ studentId: 1 })

module.exports = mongoose.model('NoticeView', noticeViewSchema)
