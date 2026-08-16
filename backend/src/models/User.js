const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, unique: true, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'dept_admin', 'super_admin'],
    default: 'student',
  },
  // Academic identity (for students)
  studentId: { type: String, sparse: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  // Notification preferences
  notificationPreferences: {
    examination: { type: Boolean, default: true },
    timetable: { type: Boolean, default: true },
    department: { type: Boolean, default: true },
    circular: { type: Boolean, default: true },
    events: { type: Boolean, default: false },
    pushEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: false },
    aiSummaryEnabled: { type: Boolean, default: true },
  },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

userSchema.methods.toPublic = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  return obj
}

module.exports = mongoose.model('User', userSchema)
