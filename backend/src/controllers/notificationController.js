const NotificationDelivery = require('../models/NotificationDelivery')
const Notification = require('../models/Notification')

const getNotifications = async (req, res, next) => {
  try {
    const deliveries = await NotificationDelivery.find({ recipientId: req.user._id })
      .populate({
        path: 'notificationId',
        populate: { path: 'noticeId', select: 'title category priority departmentId fileUrl' }
      })
      .sort({ createdAt: -1 })
      .limit(50)

    const unreadCount = await NotificationDelivery.countDocuments({
      recipientId: req.user._id,
      status: { $ne: 'READ' }
    })

    const formatted = deliveries.map(d => ({
      id: d._id,
      notificationId: d.notificationId?._id,
      noticeId: d.notificationId?.noticeId?._id,
      title: d.notificationId?.title || 'Notice Update',
      message: d.notificationId?.message || '',
      type: d.notificationId?.priority === 'High' ? 'urgent' : 'info',
      time: d.createdAt,
      read: d.status === 'READ'
    }))

    res.json({ success: true, notifications: formatted, unreadCount })
  } catch (err) {
    next(err)
  }
}

const markAsRead = async (req, res, next) => {
  try {
    await NotificationDelivery.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user._id },
      { status: 'READ', readAt: new Date() }
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

const markAllAsRead = async (req, res, next) => {
  try {
    await NotificationDelivery.updateMany(
      { recipientId: req.user._id, status: { $ne: 'READ' } },
      { status: 'READ', readAt: new Date() }
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { getNotifications, markAsRead, markAllAsRead }
