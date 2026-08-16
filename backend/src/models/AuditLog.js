const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorEmail: { type: String },
  actorRole: { type: String },
  action: { type: String, required: true },
  entity: { type: String }, // 'Notice', 'User', 'Department', etc.
  entityId: { type: mongoose.Schema.Types.ObjectId },
  metadata: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true })

auditLogSchema.index({ actorId: 1, createdAt: -1 })
auditLogSchema.index({ entity: 1, entityId: 1 })

module.exports = mongoose.model('AuditLog', auditLogSchema)
