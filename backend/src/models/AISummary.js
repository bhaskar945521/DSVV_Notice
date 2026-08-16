const mongoose = require('mongoose')

const aiSummarySchema = new mongoose.Schema({
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true, unique: true },
  overview: { type: String },
  keyPoints: [{ type: String }],
  importantDate: { type: String },
  actionRequired: { type: String },
  category: { type: String },
  priority: { type: String },
  provider: { type: String, default: 'demo' },
  model: { type: String, default: 'demo' },
  isDemo: { type: Boolean, default: true },
  generatedAt: { type: Date, default: Date.now },
  usageCount: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('AISummary', aiSummarySchema)
