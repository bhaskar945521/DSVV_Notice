const mongoose = require('mongoose')

const notificationDeliverySchema = new mongoose.Schema({
  notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'],
    default: 'SENT',
  },
  deliveredAt: { type: Date, default: Date.now },
  readAt: { type: Date },
  openedAt: { type: Date },
}, { timestamps: true })

notificationDeliverySchema.index({ recipientId: 1, status: 1 })
notificationDeliverySchema.index({ notificationId: 1 })

module.exports = mongoose.model('NotificationDelivery', notificationDeliverySchema)
