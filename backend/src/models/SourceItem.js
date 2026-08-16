const mongoose = require('mongoose')

const sourceItemSchema = new mongoose.Schema({
  connectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'SourceConnector', required: true },
  title: { type: String, required: true },
  excerpt: { type: String },
  sourceUrl: { type: String },
  extractedText: { type: String },
  detectedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'approved', 'rejected', 'published'],
    default: 'new',
  },
  aiAnalysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIAnalysis' },
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice' }, // if converted to notice
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('SourceItem', sourceItemSchema)
