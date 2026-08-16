const mongoose = require('mongoose')

const savedNoticeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
}, { timestamps: true })

savedNoticeSchema.index({ studentId: 1, noticeId: 1 }, { unique: true })

module.exports = mongoose.model('SavedNotice', savedNoticeSchema)
