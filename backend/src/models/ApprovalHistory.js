const mongoose = require('mongoose')

const approvalHistorySchema = new mongoose.Schema({
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: {
    type: String,
    enum: ['submitted', 'ai_analyzed', 'approved', 'rejected', 'changes_requested', 'published', 'archived', 'edited'],
    required: true,
  },
  comment: { type: String },
  previousStatus: { type: String },
  newStatus: { type: String },
}, { timestamps: true })

approvalHistorySchema.index({ noticeId: 1, createdAt: -1 })

module.exports = mongoose.model('ApprovalHistory', approvalHistorySchema)
