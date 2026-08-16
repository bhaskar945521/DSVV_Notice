const NoticeTarget = require('../../models/NoticeTarget')
const Notice = require('../../models/Notice')

class TargetingService {
  /**
   * Resolves list of Notice IDs applicable for a specific student user.
   */
  async getNoticesForStudent(studentUser) {
    const { departmentId, courseId, semesterId, sectionId, _id: studentId } = studentUser

    // Find all published notices
    const publishedNotices = await Notice.find({ status: 'Published' }).select('_id targetType isCentral departmentId')

    const applicableNoticeIds = []

    for (const notice of publishedNotices) {
      if (notice.isCentral || notice.targetType === 'UNIVERSITY') {
        applicableNoticeIds.push(notice._id)
        continue
      }

      // Check specific target rule document if exists
      const targetRule = await NoticeTarget.findOne({ noticeId: notice._id })

      if (!targetRule) {
        // Fallback: match by notice departmentId or course/semester matching
        if (notice.targetType === 'DEPARTMENT' && notice.departmentId && departmentId) {
          if (notice.departmentId.toString() === departmentId._id?.toString() || notice.departmentId.toString() === departmentId.toString()) {
            applicableNoticeIds.push(notice._id)
          }
        } else {
          // If no target rule, default allow if department matches or if central
          applicableNoticeIds.push(notice._id)
        }
        continue
      }

      // Evaluate explicit NoticeTarget rules
      let isMatch = false

      switch (targetRule.targetType) {
        case 'UNIVERSITY':
          isMatch = true
          break

        case 'DEPARTMENT':
          if (departmentId && targetRule.departmentIds?.some(d => d.toString() === (departmentId._id || departmentId).toString())) {
            isMatch = true
          }
          break

        case 'COURSE':
          if (courseId && targetRule.courseIds?.some(c => c.toString() === (courseId._id || courseId).toString())) {
            isMatch = true
          }
          break

        case 'SEMESTER':
          if (semesterId && targetRule.semesterIds?.some(s => s.toString() === (semesterId._id || semesterId).toString())) {
            isMatch = true
          }
          break

        case 'SECTION':
          if (sectionId && targetRule.sectionIds?.some(sec => sec.toString() === (sectionId._id || sectionId).toString())) {
            isMatch = true
          }
          break

        case 'STUDENTS':
          if (studentId && targetRule.userIds?.some(u => u.toString() === studentId.toString())) {
            isMatch = true
          }
          break

        default:
          isMatch = true
      }

      if (isMatch) {
        applicableNoticeIds.push(notice._id)
      }
    }

    return applicableNoticeIds
  }
}

module.exports = new TargetingService()
