const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authenticate = require('../middleware/authenticate')
const authorizeRole = require('../middleware/authorizeRole')

router.get('/', authenticate, authorizeRole('super_admin'), userController.getUsers)
router.patch('/preferences', authenticate, userController.updatePreferences)
router.patch('/:id', authenticate, authorizeRole('super_admin'), userController.updateUser)
router.delete('/:id', authenticate, authorizeRole('super_admin'), userController.deleteUser)

module.exports = router
