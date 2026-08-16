const express = require('express')
const router = express.Router()
const noticeController = require('../controllers/noticeController')
const approvalController = require('../controllers/approvalController')
const authenticate = require('../middleware/authenticate')
const authorizeRole = require('../middleware/authorizeRole')
const upload = require('../middleware/upload')

router.get('/', authenticate, noticeController.getNotices)
router.get('/saved', authenticate, authorizeRole('student'), noticeController.getSavedNotices)
router.get('/pending', authenticate, authorizeRole('super_admin'), approvalController.getPending)
router.get('/:id', authenticate, noticeController.getNotice)

router.post('/', authenticate, authorizeRole('dept_admin', 'super_admin'), noticeController.createNotice)
router.patch('/:id', authenticate, authorizeRole('dept_admin', 'super_admin'), noticeController.updateNotice)
router.delete('/:id', authenticate, authorizeRole('dept_admin', 'super_admin'), noticeController.deleteNotice)

router.post('/:id/upload', authenticate, authorizeRole('dept_admin', 'super_admin'), upload.single('file'), noticeController.uploadFile)
router.post('/:id/submit', authenticate, authorizeRole('dept_admin', 'super_admin'), noticeController.submitForApproval)

router.post('/:id/approve', authenticate, authorizeRole('super_admin'), approvalController.approveNotice)
router.post('/:id/reject', authenticate, authorizeRole('super_admin'), approvalController.rejectNotice)
router.post('/:id/request-changes', authenticate, authorizeRole('super_admin'), approvalController.requestChanges)
router.post('/:id/archive', authenticate, authorizeRole('super_admin'), approvalController.archiveNotice)
router.get('/:id/approval-history', authenticate, noticeController.getApprovalHistory)

router.post('/:id/save', authenticate, authorizeRole('student'), noticeController.saveNotice)
router.post('/:id/track', authenticate, noticeController.trackEvent)
router.post('/:id/targets', authenticate, authorizeRole('dept_admin', 'super_admin'), noticeController.setTargets)
router.get('/:id/targets', authenticate, noticeController.getTargets)

module.exports = router
