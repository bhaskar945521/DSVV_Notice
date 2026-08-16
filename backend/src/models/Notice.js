const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  sourceType: {
    type: String,
    enum: ['manual', 'dept_admin', 'auto_detected', 'imported'],
    default: 'dept_admin',
  },
  sourceUrl: { type: String }, // original URL if auto-detected
  fileUrl: { type: String },   // uploaded PDF path
  fileName: { type: String },
  extractedText: { type: String }, // from PDF extraction
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  category: {
    type: String,
    enum: ['Examination', 'Timetable', 'Circular', 'Academic', 'Admission', 'Holiday', 'Event', 'Notice', 'Workshop', 'Seminar', 'Assignment', 'Placement', 'Other'],
    default: 'Notice',
  },
  noticeType: { type: String, default: 'General' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'AI_Review', 'Approved', 'Published', 'Rejected', 'Scheduled', 'Archived'],
    default: 'Draft',
  },
  rejectionReason: { type: String },
  adminComment: { type: String },
  importantDate: { type: Date },
  expiryDate: { type: Date },
  publishedAt: { type: Date },
  scheduledAt: { type: Date },
  aiAnalysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIAnalysis' },
  aiSummaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'AISummary' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Targeting scope
  targetType: {
    type: String,
    enum: ['UNIVERSITY', 'DEPARTMENT', 'COURSE', 'SEMESTER', 'SECTION', 'STUDENTS'],
    default: 'UNIVERSITY',
  },
  tags: [{ type: String }],
  isCentral: { type: Boolean, default: false }, // university-wide central notice
  viewCount: { type: Number, default: 0 },
  notificationSentAt: { type: Date },
}, { timestamps: true })

noticeSchema.index({ status: 1, publishedAt: -1 })
noticeSchema.index({ departmentId: 1, status: 1 })
noticeSchema.index({ category: 1 })
noticeSchema.index({ createdBy: 1 })

module.exports = mongoose.model('Notice', noticeSchema)
