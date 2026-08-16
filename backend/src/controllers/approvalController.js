const Notice = require('../models/Notice')
const ApprovalHistory = require('../models/ApprovalHistory')
const NoticeTarget = require('../models/NoticeTarget')
const notificationService = require('../services/notifications/notificationService')
const AuditLog = require('../models/AuditLog')

// GET /api/approvals — pending notices
const getPending = async (req, res, next) => {
  try {
    const { status = 'Pending' } = req.query
    const notices = await Notice.find({ status })
      .populate('departmentId', 'name code')
      .populate('createdBy', 'name email')
      .populate('aiAnalysisId')
      .sort({ createdAt: -1 })
    res.json({ success: true, notices })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices/:id/approve
const approveNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' })
    if (!['Pending', 'AI_Review'].includes(notice.status)) {
      return res.status(400).json({ success: false, message: 'Notice is not pending approval.' })
    }

    const previousStatus = notice.status
    notice.status = 'Published'
    notice.approvedBy = req.user._id
    notice.publishedAt = new Date()
    await notice.save()

    await ApprovalHistory.create({
      noticeId: notice._id,
      actorId: req.user._id,
      action: 'approved',
      previousStatus,
      newStatus: 'Published',
      comment: req.body.comment,
    })

    await AuditLog.create({
      actorId: req.user._id,
      actorEmail: req.user.email,
      actorRole: req.user.role,
      action: 'notice_approved',
      entity: 'Notice',
      entityId: notice._id,
      metadata: { title: notice.title },
    })

    // Send notifications to target audience
    try {
      await notificationService.sendForNotice(notice)
    } catch (notifErr) {
      console.warn('Notification sending failed:', notifErr.message)
    }

    const populated = await Notice.findById(notice._id)
      .populate('departmentId', 'name code')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name')

    res.json({ success: true, notice: populated })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices/:id/reject
const rejectNotice = async (req, res, next) => {
  try {
    const { reason, comment } = req.body
    if (!reason) return res.status(400).json({ success: false, message: 'Rejection reason is required.' })

    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' })

    const previousStatus = notice.status
    notice.status = 'Rejected'
    notice.rejectionReason = reason
    notice.adminComment = comment
    await notice.save()

    await ApprovalHistory.create({
      noticeId: notice._id,
      actorId: req.user._id,
      action: 'rejected',
      previousStatus,
      newStatus: 'Rejected',
      comment: reason,
    })

    res.json({ success: true, notice })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices/:id/request-changes
const requestChanges = async (req, res, next) => {
  try {
    const { comment } = req.body
    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' })

    const previousStatus = notice.status
    notice.status = 'Draft'
    notice.adminComment = comment
    await notice.save()

    await ApprovalHistory.create({
      noticeId: notice._id,
      actorId: req.user._id,
      action: 'changes_requested',
      previousStatus,
      newStatus: 'Draft',
      comment,
    })

    res.json({ success: true, notice })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices/:id/archive
const archiveNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { status: 'Archived' },
      { new: true }
    )
    await ApprovalHistory.create({
      noticeId: req.params.id,
      actorId: req.user._id,
      action: 'archived',
      newStatus: 'Archived',
    })
    res.json({ success: true, notice })
  } catch (err) {
    next(err)
  }
}

module.exports = { getPending, approveNotice, rejectNotice, requestChanges, archiveNotice }
