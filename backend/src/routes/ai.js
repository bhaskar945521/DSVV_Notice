const express = require('express')
const router = express.Router()
const aiController = require('../controllers/aiController')
const authenticate = require('../middleware/authenticate')

router.post('/analyze-notice', authenticate, aiController.analyzeNotice)
router.post('/summarize-notice', authenticate, aiController.summarizeNotice)
router.post('/suggest-audience', authenticate, aiController.suggestAudience)

module.exports = router
