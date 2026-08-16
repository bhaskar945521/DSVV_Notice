const mongoose = require('mongoose')

const noticeTargetSchema = new mongoose.Schema({
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true, unique: true },
  targetType: {
    type: String,
    enum: ['UNIVERSITY', 'DEPARTMENT', 'COURSE', 'SEMESTER', 'SECTION', 'STUDENTS'],
    default: 'UNIVERSITY',
  },
  departmentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
  courseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  semesterIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Semester' }],
  sectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

module.exports = mongoose.model('NoticeTarget', noticeTargetSchema)
