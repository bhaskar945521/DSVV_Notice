const express = require('express')
const router = express.Router()
const { login, getMe, logout, register } = require('../controllers/authController')
const authenticate = require('../middleware/authenticate')

router.post('/login', login)
router.post('/register', register)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getMe)

module.exports = router
