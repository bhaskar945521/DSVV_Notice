const Notification = require('../../models/Notification')
const NotificationDelivery = require('../../models/NotificationDelivery')
const User = require('../../models/User')
const NoticeTarget = require('../../models/NoticeTarget')

class NotificationService {
  async sendForNotice(notice) {
    // Create central notification record
    const notification = await Notification.create({
      noticeId: notice._id,
      title: notice.title,
      message: notice.description ? notice.description.substring(0, 120) + '...' : `New ${notice.category} published.`,
      type: 'IN_APP',
      priority: notice.priority || 'Medium'
    })

    // Resolve recipients based on targetType
    let recipientQuery = { role: 'student', isActive: true }

    const targetRule = await NoticeTarget.findOne({ noticeId: notice._id })
    if (targetRule) {
      if (targetRule.targetType === 'DEPARTMENT' && targetRule.departmentIds?.length > 0) {
        recipientQuery.departmentId = { $in: targetRule.departmentIds }
      } else if (targetRule.targetType === 'COURSE' && targetRule.courseIds?.length > 0) {
        recipientQuery.courseId = { $in: targetRule.courseIds }
      } else if (targetRule.targetType === 'SEMESTER' && targetRule.semesterIds?.length > 0) {
        recipientQuery.semesterId = { $in: targetRule.semesterIds }
      } else if (targetRule.targetType === 'SECTION' && targetRule.sectionIds?.length > 0) {
        recipientQuery.sectionId = { $in: targetRule.sectionIds }
      } else if (targetRule.targetType === 'STUDENTS' && targetRule.userIds?.length > 0) {
        recipientQuery._id = { $in: targetRule.userIds }
      }
    } else if (notice.departmentId && !notice.isCentral) {
      recipientQuery.departmentId = notice.departmentId
    }

    const recipients = await User.find(recipientQuery).select('_id')

    // Create delivery records
    const deliveries = recipients.map(r => ({
      notificationId: notification._id,
      recipientId: r._id,
      status: 'DELIVERED',
      deliveredAt: new Date()
    }))

    if (deliveries.length > 0) {
      await NotificationDelivery.insertMany(deliveries)
    }

    notice.notificationSentAt = new Date()
    await notice.save()

    return { notificationId: notification._id, recipientCount: deliveries.length }
  }
}

module.exports = new NotificationService()
