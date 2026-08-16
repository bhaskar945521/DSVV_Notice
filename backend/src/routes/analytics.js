const express = require('express')
const router = express.Router()
const analyticsController = require('../controllers/analyticsController')
const authenticate = require('../middleware/authenticate')
const authorizeRole = require('../middleware/authorizeRole')

router.get('/overview', authenticate, authorizeRole('dept_admin', 'super_admin'), analyticsController.getOverview)
router.get('/notices/:id', authenticate, authorizeRole('dept_admin', 'super_admin'), analyticsController.getNoticeAnalytics)

module.exports = router
