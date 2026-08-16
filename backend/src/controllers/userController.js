const User = require('../models/User')

const getUsers = async (req, res, next) => {
  try {
    const { role, search, departmentId } = req.query
    const query = {}
    if (role) query.role = role
    if (departmentId) query.departmentId = departmentId
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ]
    }
    const users = await User.find(query)
      .select('-passwordHash')
      .populate('departmentId', 'name code')
      .populate('courseId', 'name code')
      .populate('semesterId', 'number label')
      .sort({ createdAt: -1 })

    res.json({ success: true, users })
  } catch (err) {
    next(err)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const fields = ['name', 'role', 'departmentId', 'courseId', 'semesterId', 'sectionId', 'isActive', 'notificationPreferences']
    fields.forEach(f => {
      if (req.body[f] !== undefined) user[f] = req.body[f]
    })

    await user.save()
    res.json({ success: true, user: user.toPublic() })
  } catch (err) {
    next(err)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...req.body
    }
    await user.save()
    res.json({ success: true, preferences: user.notificationPreferences })
  } catch (err) {
    next(err)
  }
}

module.exports = { getUsers, updateUser, deleteUser, updatePreferences }
