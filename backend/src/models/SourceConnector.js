const mongoose = require('mongoose')

const sourceConnectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['website', 'rss', 'api', 'manual'], default: 'website' },
  isActive: { type: Boolean, default: true },
  checkIntervalMinutes: { type: Number, default: 30 },
  lastCheckedAt: { type: Date },
  lastItemsFound: { type: Number, default: 0 },
  status: { type: String, enum: ['connected', 'disconnected', 'error'], default: 'connected' },
  description: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('SourceConnector', sourceConnectorSchema)
