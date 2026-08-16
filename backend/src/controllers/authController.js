const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AuditLog = require('../models/AuditLog')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .populate('departmentId', 'name code')
      .populate('courseId', 'name code')
      .populate('semesterId', 'number label')

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    const valid = await user.comparePassword(password)
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    user.lastLoginAt = new Date()
    await user.save({ validateBeforeSave: false })

    // Audit log
    await AuditLog.create({
      actorId: user._id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'login',
      entity: 'User',
      entityId: user._id,
      ipAddress: req.ip,
    })

    const token = signToken(user._id)
    res.json({ success: true, token, user: user.toPublic() })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toPublic ? req.user.toPublic() : req.user })
}

// POST /api/auth/logout
const logout = async (req, res) => {
  // JWT is stateless — client should discard token
  res.json({ success: true, message: 'Logged out successfully.' })
}

// POST /api/auth/register (super admin only in production)
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, studentId, departmentId, courseId, semesterId, sectionId } = req.body
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' })
    }
    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: role || 'student',
      studentId,
      departmentId,
      courseId,
      semesterId,
      sectionId,
    })
    const token = signToken(user._id)
    const populated = await User.findById(user._id)
      .populate('departmentId', 'name code')
      .populate('courseId', 'name code')
      .populate('semesterId', 'number label')
    res.status(201).json({ success: true, token, user: populated.toPublic() })
  } catch (err) {
    next(err)
  }
}

module.exports = { login, getMe, logout, register }
