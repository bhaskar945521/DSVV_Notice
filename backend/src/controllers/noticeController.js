const Notice = require('../models/Notice')
const NoticeTarget = require('../models/NoticeTarget')
const NoticeView = require('../models/NoticeView')
const AIAnalysis = require('../models/AIAnalysis')
const AISummary = require('../models/AISummary')
const ApprovalHistory = require('../models/ApprovalHistory')
const SavedNotice = require('../models/SavedNotice')
const targetingService = require('../services/targeting/targetingService')
const notificationService = require('../services/notifications/notificationService')
const analyticsService = require('../services/analytics/analyticsService')
const aiService = require('../services/ai')
const path = require('path')

// GET /api/notices — filtered by role + targeting
const getNotices = async (req, res, next) => {
  try {
    const { category, priority, department, search, source, status, page = 1, limit = 20, central } = req.query
    const user = req.user

    let query = {}

    // Role-based filtering
    if (user.role === 'student') {
      query.status = 'Published'
      if (!req.query.all) {
        // Get notices targeted to this student
        const targetedIds = await targetingService.getNoticesForStudent(user)
        query._id = { $in: targetedIds }
      }
      if (central === 'true') {
        query.isCentral = true
        delete query._id
      }
    } else if (user.role === 'dept_admin') {
      if (status) query.status = status
      if (!req.query.all) {
        query.$or = [
          { departmentId: user.departmentId?._id || user.departmentId },
          { createdBy: user._id },
        ]
      }
    }
    // super_admin sees all

    if (category) query.category = category
    if (priority) query.priority = priority
    if (source) query.sourceType = source
    if (status && user.role === 'super_admin') query.status = status
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }
    if (department && user.role !== 'student') {
      query.departmentId = department
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [notices, total] = await Promise.all([
      Notice.find(query)
        .populate('departmentId', 'name code')
        .populate('createdBy', 'name email')
        .populate('approvedBy', 'name')
        .populate('aiAnalysisId')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notice.countDocuments(query),
    ])

    res.json({ success: true, notices, total, page: parseInt(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

// GET /api/notices/:id
const getNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('departmentId', 'name code')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name')
      .populate('aiAnalysisId')
      .populate('aiSummaryId')

    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' })

    // Track view event for students
    if (req.user.role === 'student' && notice.status === 'Published') {
      await analyticsService.trackEvent(notice._id, req.user._id, 'VIEWED')
    }

    res.json({ success: true, notice })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices — create
const createNotice = async (req, res, next) => {
  try {
    const { title, description, category, priority, importantDate, expiryDate, isCentral, targetType, tags } = req.body

    const notice = await Notice.create({
      title,
      description,
      category: category || 'Notice',
      priority: priority || 'Medium',
      status: 'Draft',
      departmentId: req.user.departmentId?._id || req.user.departmentId,
      createdBy: req.user._id,
      importantDate: importantDate || undefined,
      expiryDate: expiryDate || undefined,
      isCentral: isCentral || false,
      targetType: targetType || (isCentral ? 'UNIVERSITY' : 'DEPARTMENT'),
      tags: tags || [],
      sourceType: 'dept_admin',
    })

    await ApprovalHistory.create({
      noticeId: notice._id,
      actorId: req.user._id,
      action: 'submitted',
      previousStatus: null,
      newStatus: 'Draft',
    })

    res.status(201).json({ success: true, notice })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/notices/:id
const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' })

    // Dept admin can only edit their department's notices
    if (req.user.role === 'dept_admin') {
      const deptId = req.user.departmentId?._id?.toString() || req.user.departmentId?.toString()
      if (notice.departmentId?.toString() !== deptId && notice.createdBy?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied.' })
      }
      if (!['Draft', 'Rejected'].includes(notice.status)) {
        return res.status(400).json({ success: false, message: 'Cannot edit a submitted notice.' })
      }
    }

    const allowedFields = ['title', 'description', 'category', 'priority', 'importantDate', 'expiryDate', 'tags', 'isCentral', 'targetType']
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) notice[f] = req.body[f] })

    await notice.save()
    res.json({ success: true, notice })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/notices/:id
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' })

    if (req.user.role === 'dept_admin' && notice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' })
    }

    await Notice.deleteOne({ _id: notice._id })
    res.json({ success: true, message: 'Notice deleted.' })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices/:id/upload — PDF upload + text extraction
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' })

    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' })

    notice.fileUrl = `/uploads/${req.file.filename}`
    notice.fileName = req.file.originalname

    // Extract text from PDF
    let extractedText = ''
    if (req.file.mimetype === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse')
        const fs = require('fs')
        const dataBuffer = fs.readFileSync(req.file.path)
        const pdfData = await pdfParse(dataBuffer)
        extractedText = pdfData.text || ''
      } catch (pdfErr) {
        console.warn('PDF text extraction failed:', pdfErr.message)
      }
    }

    notice.extractedText = extractedText
    await notice.save()

    res.json({ success: true, fileUrl: notice.fileUrl, extractedText: extractedText.substring(0, 500) + '...' })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices/:id/submit — submit for approval
const submitForApproval = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' })

    if (!['Draft', 'Rejected'].includes(notice.status)) {
      return res.status(400).json({ success: false, message: 'Only draft or rejected notices can be submitted.' })
    }

    const previousStatus = notice.status
    notice.status = 'Pending'
    await notice.save()

    await ApprovalHistory.create({
      noticeId: notice._id,
      actorId: req.user._id,
      action: 'submitted',
      previousStatus,
      newStatus: 'Pending',
      comment: req.body.comment,
    })

    res.json({ success: true, notice })
  } catch (err) {
    next(err)
  }
}

// GET /api/notices/:id/approval-history
const getApprovalHistory = async (req, res, next) => {
  try {
    const history = await ApprovalHistory.find({ noticeId: req.params.id })
      .populate('actorId', 'name email role')
      .sort({ createdAt: 1 })
    res.json({ success: true, history })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices/:id/save — student saves notice
const saveNotice = async (req, res, next) => {
  try {
    const existing = await SavedNotice.findOne({ studentId: req.user._id, noticeId: req.params.id })
    if (existing) {
      await SavedNotice.deleteOne({ _id: existing._id })
      return res.json({ success: true, saved: false })
    }
    await SavedNotice.create({ studentId: req.user._id, noticeId: req.params.id })
    await analyticsService.trackEvent(req.params.id, req.user._id, 'SAVED')
    res.json({ success: true, saved: true })
  } catch (err) {
    next(err)
  }
}

// GET /api/notices/saved — student saved notices
const getSavedNotices = async (req, res, next) => {
  try {
    const saved = await SavedNotice.find({ studentId: req.user._id })
      .populate({
        path: 'noticeId',
        populate: { path: 'departmentId', select: 'name code' },
      })
      .sort({ createdAt: -1 })
    res.json({ success: true, notices: saved.map((s) => s.noticeId).filter(Boolean) })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices/:id/track — track analytics event
const trackEvent = async (req, res, next) => {
  try {
    const { action } = req.body
    if (!['VIEWED', 'OPENED', 'SUMMARIZED', 'DOWNLOADED', 'SAVED'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action.' })
    }
    await analyticsService.trackEvent(req.params.id, req.user._id, action)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

// POST /api/notices/:id/targets — set audience
const setTargets = async (req, res, next) => {
  try {
    const { targetType, departmentIds, courseIds, semesterIds, sectionIds, userIds } = req.body
    const target = await NoticeTarget.findOneAndUpdate(
      { noticeId: req.params.id },
      { noticeId: req.params.id, targetType, departmentIds, courseIds, semesterIds, sectionIds, userIds },
      { upsert: true, new: true }
    )
    await Notice.findByIdAndUpdate(req.params.id, { targetType })
    res.json({ success: true, target })
  } catch (err) {
    next(err)
  }
}

// GET /api/notices/:id/targets
const getTargets = async (req, res, next) => {
  try {
    const target = await NoticeTarget.findOne({ noticeId: req.params.id })
    res.json({ success: true, target })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getNotices, getNotice, createNotice, updateNotice, deleteNotice,
  uploadFile, submitForApproval, getApprovalHistory,
  saveNotice, getSavedNotices, trackEvent, setTargets, getTargets,
}
