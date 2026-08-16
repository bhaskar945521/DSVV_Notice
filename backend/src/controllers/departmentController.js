const Department = require('../models/Department')
const Notice = require('../models/Notice')

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true }).populate('schoolId', 'name code')
    
    // Attach notice counts
    const deptList = await Promise.all(departments.map(async d => {
      const noticeCount = await Notice.countDocuments({ departmentId: d._id })
      return {
        ...d.toObject(),
        noticesCount: noticeCount
      }
    }))

    res.json({ success: true, departments: deptList })
  } catch (err) {
    next(err)
  }
}

const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body)
    res.status(201).json({ success: true, department })
  } catch (err) {
    next(err)
  }
}

const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, department })
  } catch (err) {
    next(err)
  }
}

const deleteDepartment = async (req, res, next) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ success: true, message: 'Department deactivated' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment }
