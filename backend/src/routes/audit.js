const express = require('express')
const router = express.Router()
const academicController = require('../controllers/academicController')
const authenticate = require('../middleware/authenticate')
const authorizeRole = require('../middleware/authorizeRole')

router.get('/', authenticate, authorizeRole('super_admin'), academicController.getAuditLogs)

module.exports = router
