require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

const errorHandler = require('./middleware/errorHandler')

// Route imports
const authRoutes = require('./routes/auth')
const noticeRoutes = require('./routes/notices')
const userRoutes = require('./routes/users')
const departmentRoutes = require('./routes/departments')
const courseRoutes = require('./routes/courses')
const semesterRoutes = require('./routes/semesters')
const sectionRoutes = require('./routes/sections')
const notificationRoutes = require('./routes/notifications')
const analyticsRoutes = require('./routes/analytics')
const aiRoutes = require('./routes/ai')
const sourceRoutes = require('./routes/sources')
const auditRoutes = require('./routes/audit')
const announcementRoutes = require('./routes/announcements')

const app = express()

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Static files — uploaded PDFs
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DSVV Notice Aggregator API', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/users', userRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/semesters', semesterRoutes)
app.use('/api/sections', sectionRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/sources', sourceRoutes)
app.use('/api/audit-logs', auditRoutes)
app.use('/api/announcements', announcementRoutes)

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler
app.use(errorHandler)

module.exports = app
