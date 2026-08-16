const Course = require('../models/Course')
const Semester = require('../models/Semester')
const Section = require('../models/Section')
const AuditLog = require('../models/AuditLog')
const Announcement = require('../models/Announcement')

const getCourses = async (req, res, next) => {
  try {
    const { departmentId } = req.query
    const query = { isActive: true }
    if (departmentId) query.departmentId = departmentId
    const courses = await Course.find(query).populate('departmentId', 'name code')
    res.json({ success: true, courses })
  } catch (err) {
    next(err)
  }
}

const getSemesters = async (req, res, next) => {
  try {
    const { courseId } = req.query
    const query = { isActive: true }
    if (courseId) query.courseId = courseId
    const semesters = await Semester.find(query).sort({ number: 1 })
    res.json({ success: true, semesters })
  } catch (err) {
    next(err)
  }
}

const getSections = async (req, res, next) => {
  try {
    const { semesterId, courseId } = req.query
    const query = { isActive: true }
    if (semesterId) query.semesterId = semesterId
    if (courseId) query.courseId = courseId
    const sections = await Section.find(query)
    res.json({ success: true, sections })
  } catch (err) {
    next(err)
  }
}

const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100)
    res.json({ success: true, logs })
  } catch (err) {
    next(err)
  }
}

const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 })
    res.json({ success: true, announcements })
  } catch (err) {
    next(err)
  }
}

module.exports = { getCourses, getSemesters, getSections, getAuditLogs, getAnnouncements }
