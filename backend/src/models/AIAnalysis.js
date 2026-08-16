const mongoose = require('mongoose')

const aiAnalysisSchema = new mongoose.Schema({
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
  extractedText: { type: String },
  // AI suggestions
  departmentSuggestion: { type: String },
  courseSuggestion: { type: String },
  semesterSuggestion: { type: String },
  sectionSuggestion: { type: String },
  categorySuggestion: { type: String },
  noticeTypeSuggestion: { type: String },
  prioritySuggestion: { type: String },
  audienceSuggestion: { type: String },
  importantDate: { type: Date },
  targetTypeSuggestion: { type: String },
  keywords: [{ type: String }],
  confidence: { type: Number, default: 0 }, // 0–100
  model: { type: String, default: 'demo' },
  provider: { type: String, default: 'demo' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'needs_review'],
    default: 'pending',
  },
  // Admin actions on AI suggestions
  adminAccepted: { type: Boolean },
  adminModified: { type: Boolean },
  adminReviewedAt: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('AIAnalysis', aiAnalysisSchema)
