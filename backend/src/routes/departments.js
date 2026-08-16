const express = require('express')
const router = express.Router()
const departmentController = require('../controllers/departmentController')
const authenticate = require('../middleware/authenticate')
const authorizeRole = require('../middleware/authorizeRole')

router.get('/', authenticate, departmentController.getDepartments)
router.post('/', authenticate, authorizeRole('super_admin'), departmentController.createDepartment)
router.patch('/:id', authenticate, authorizeRole('super_admin'), departmentController.updateDepartment)
router.delete('/:id', authenticate, authorizeRole('super_admin'), departmentController.deleteDepartment)

module.exports = router
