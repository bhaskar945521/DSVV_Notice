require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')
const School = require('../models/School')
const Department = require('../models/Department')
const Course = require('../models/Course')
const Semester = require('../models/Semester')
const Section = require('../models/Section')
const Notice = require('../models/Notice')
const NoticeTarget = require('../models/NoticeTarget')
const Notification = require('../models/Notification')
const NotificationDelivery = require('../models/NotificationDelivery')
const SourceConnector = require('../models/SourceConnector')
const SourceItem = require('../models/SourceItem')
const AIAnalysis = require('../models/AIAnalysis')
const AISummary = require('../models/AISummary')
const Announcement = require('../models/Announcement')

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsvv_notices')
    console.log('🌱 Connected to MongoDB for seeding...')

    // Clear existing
    await Promise.all([
      User.deleteMany({}),
      School.deleteMany({}),
      Department.deleteMany({}),
      Course.deleteMany({}),
      Semester.deleteMany({}),
      Section.deleteMany({}),
      Notice.deleteMany({}),
      NoticeTarget.deleteMany({}),
      Notification.deleteMany({}),
      NotificationDelivery.deleteMany({}),
      SourceConnector.deleteMany({}),
      SourceItem.deleteMany({}),
      AIAnalysis.deleteMany({}),
      AISummary.deleteMany({}),
      Announcement.deleteMany({})
    ])

    console.log('🧹 Cleaned database collections.')

    // 1. Create Schools
    const schoolIndology = await School.create({ name: 'School of Indology & Holistic Health', code: 'SIHH' })
    const schoolTech = await School.create({ name: 'School of Technology & Applied Sciences', code: 'STAS' })
    const schoolHumanities = await School.create({ name: 'School of Humanities & Social Sciences', code: 'SHSS' })

    // 2. Create Departments
    const deptCS = await Department.create({
      name: 'Department of Computer Science & IT',
      code: 'CS',
      schoolId: schoolTech._id,
      hodName: 'Prof. Anil Verma',
      email: 'cs@dsvv.ac.in'
    })

    const deptYoga = await Department.create({
      name: 'Department of Yogic Sciences and Human Consciousness',
      code: 'YOGA',
      schoolId: schoolIndology._id,
      hodName: 'Dr. Rakesh Sharma',
      email: 'yoga@dsvv.ac.in'
    })

    const deptPsych = await Department.create({
      name: 'Department of Psychology',
      code: 'PSYCH',
      schoolId: schoolHumanities._id,
      hodName: 'Dr. Priya Patel',
      email: 'psychology@dsvv.ac.in'
    })

    const deptAdmin = await Department.create({
      name: 'Administration',
      code: 'ADMIN',
      schoolId: schoolHumanities._id,
      hodName: 'Mr. Ashok Kumar',
      email: 'admin@dsvv.ac.in'
    })

    // 3. Create Courses
    const courseBCA = await Course.create({
      name: 'Bachelor of Computer Applications (BCA)',
      code: 'BCA',
      departmentId: deptCS._id,
      level: 'UG',
      totalSemesters: 6
    })

    const courseMCA = await Course.create({
      name: 'Master of Computer Applications (MCA)',
      code: 'MCA',
      departmentId: deptCS._id,
      level: 'PG',
      totalSemesters: 4
    })

    const courseYoga = await Course.create({
      name: 'B.Sc in Yogic Sciences',
      code: 'BSC-YOGA',
      departmentId: deptYoga._id,
      level: 'UG',
      totalSemesters: 6
    })

    // 4. Create Semesters
    const semBCA2 = await Semester.create({ number: 2, label: '2nd Semester', courseId: courseBCA._id })
    const semBCA4 = await Semester.create({ number: 4, label: '4th Semester', courseId: courseBCA._id })
    const semYoga2 = await Semester.create({ number: 2, label: '2nd Semester', courseId: courseYoga._id })

    // 5. Create Sections
    const secBCAA = await Section.create({ name: 'Section A', semesterId: semBCA2._id, courseId: courseBCA._id, departmentId: deptCS._id })

    // 6. Create Users
    const passwordHash = 'Demo@1234' // Pre-hashed by model pre-save hook

    const superAdmin = await User.create({
      name: 'Super Administrator',
      email: 'admin@dsvv.demo',
      passwordHash,
      role: 'super_admin'
    })

    const csAdminUser = await User.create({
      name: 'Prof. Anil Verma',
      email: 'cs.admin@dsvv.demo',
      passwordHash,
      role: 'dept_admin',
      departmentId: deptCS._id
    })

    const yogaAdminUser = await User.create({
      name: 'Dr. Rakesh Sharma',
      email: 'yoga.admin@dsvv.demo',
      passwordHash,
      role: 'dept_admin',
      departmentId: deptYoga._id
    })

    const studentBCA = await User.create({
      name: 'Rahul Sharma',
      email: 'student.bca@dsvv.demo',
      passwordHash,
      role: 'student',
      studentId: 'DSVV/BCA/2024/042',
      departmentId: deptCS._id,
      courseId: courseBCA._id,
      semesterId: semBCA2._id,
      sectionId: secBCAA._id
    })

    const studentYoga = await User.create({
      name: 'Priya Singh',
      email: 'student.yoga@dsvv.demo',
      passwordHash,
      role: 'student',
      studentId: 'DSVV/YOGA/2024/015',
      departmentId: deptYoga._id,
      courseId: courseYoga._id,
      semesterId: semYoga2._id
    })

    console.log('👤 Created Users & Academic Hierarchy.')

    // 7. Create Notices
    const notice1 = await Notice.create({
      title: 'BCA 2nd Semester Examination Timetable Updated',
      description: 'The examination timetable for BCA 2nd Semester has been revised. Students are requested to note the updated schedule carefully. Theory exams commence from 20th August 2026.',
      departmentId: deptCS._id,
      category: 'Examination',
      priority: 'High',
      status: 'Published',
      sourceType: 'auto_detected',
      sourceUrl: 'https://dsvv.ac.in/notices/bca-exam-2026',
      publishedAt: new Date(Date.now() - 3600000 * 2),
      createdBy: superAdmin._id,
      approvedBy: superAdmin._id,
      importantDate: new Date('2026-08-20'),
      targetType: 'COURSE'
    })

    await NoticeTarget.create({
      noticeId: notice1._id,
      targetType: 'COURSE',
      courseIds: [courseBCA._id]
    })

    const notice2 = await Notice.create({
      title: 'University Holiday Circular — Independence Day',
      description: 'The university will remain closed on 15th August 2026 on account of Independence Day. Flag hoisting starts at 7:30 AM.',
      departmentId: deptAdmin._id,
      category: 'Holiday',
      priority: 'Medium',
      status: 'Published',
      sourceType: 'dept_admin',
      publishedAt: new Date(Date.now() - 3600000 * 24),
      createdBy: superAdmin._id,
      approvedBy: superAdmin._id,
      isCentral: true,
      targetType: 'UNIVERSITY'
    })

    await NoticeTarget.create({
      noticeId: notice2._id,
      targetType: 'UNIVERSITY'
    })

    const notice3 = await Notice.create({
      title: 'B.Sc IT & BCA Practical Examination Schedule in Computer Lab 3',
      description: 'Practical examination schedule for BCA 2nd and 4th semester students. Exams will be conducted in the IT Lab from 22nd to 28th August 2026.',
      departmentId: deptCS._id,
      category: 'Examination',
      priority: 'High',
      status: 'Pending',
      sourceType: 'dept_admin',
      createdBy: csAdminUser._id,
      importantDate: new Date('2026-08-22'),
      targetType: 'DEPARTMENT'
    })

    const notice4 = await Notice.create({
      title: 'National Workshop on Yogic Therapy & Holistic Wellness',
      description: 'Department of Yogic Sciences is hosting a 3-day national workshop on integrative healing. Registration deadline: 25th August 2026.',
      departmentId: deptYoga._id,
      category: 'Workshop',
      priority: 'Medium',
      status: 'Published',
      sourceType: 'dept_admin',
      publishedAt: new Date(Date.now() - 3600000 * 48),
      createdBy: yogaAdminUser._id,
      approvedBy: superAdmin._id,
      targetType: 'UNIVERSITY'
    })

    console.log('📋 Seeded Notices & Audience Targets.')

    // 8. Create Notifications
    const notif1 = await Notification.create({
      noticeId: notice1._id,
      title: 'BCA 2nd Semester Examination Timetable Updated',
      message: 'Theory exams commence from 20th August 2026.',
      type: 'IN_APP',
      priority: 'High'
    })

    await NotificationDelivery.create({
      notificationId: notif1._id,
      recipientId: studentBCA._id,
      status: 'DELIVERED',
      deliveredAt: new Date()
    })

    // 9. Source Connectors
    const connector = await SourceConnector.create({
      name: 'DSVV Official Website',
      url: 'https://dsvv.ac.in',
      type: 'website',
      status: 'connected',
      lastCheckedAt: new Date(),
      lastItemsFound: 2
    })

    await SourceItem.create({
      connectorId: connector._id,
      title: 'BCA 2nd Semester Revised Examination Schedule',
      excerpt: 'The examination schedule for BCA 2nd semester has been revised and updated on official portal...',
      sourceUrl: 'https://dsvv.ac.in/notices/bca-exam',
      status: 'new'
    })

    // 10. Announcements
    await Announcement.create({
      text: '🔔 Independence Day Flag Hoisting at 7:30 AM — Central Lawn. All students invited!',
      priority: 'High'
    })

    console.log('✅ Seed Script Finished Successfully!')
    console.log('----------------------------------------------------')
    console.log('DEMO CREDENTIALS:')
    console.log('Super Admin: admin@dsvv.demo | Password: Demo@1234')
    console.log('Dept Admin:  cs.admin@dsvv.demo | Password: Demo@1234')
    console.log('Student:     student.bca@dsvv.demo | Password: Demo@1234')
    console.log('----------------------------------------------------')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err)
    process.exit(1)
  }
}

seed()
