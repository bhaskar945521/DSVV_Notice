const express = require('express')
const router = express.Router()
const sourceController = require('../controllers/sourceController')
const authenticate = require('../middleware/authenticate')
const authorizeRole = require('../middleware/authorizeRole')

router.get('/', authenticate, authorizeRole('super_admin'), sourceController.getConnectors)
router.post('/:id/check', authenticate, authorizeRole('super_admin'), sourceController.checkConnector)
router.patch('/items/:id', authenticate, authorizeRole('super_admin'), sourceController.updateSourceItem)

module.exports = router
