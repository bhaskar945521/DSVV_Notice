const express = require('express')
const router = express.Router()
const academicController = require('../controllers/academicController')
const authenticate = require('../middleware/authenticate')

router.get('/', authenticate, academicController.getSections)

module.exports = router
