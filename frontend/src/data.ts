export type NoticeStatus = 'Draft' | 'Pending' | 'Approved' | 'Published' | 'Rejected'
export type NoticeCategory =
  | 'Examination'
  | 'Timetable'
  | 'Circular'
  | 'Academic'
  | 'Admission'
  | 'Holiday'
  | 'Event'
  | 'Notice'
  | 'Other'
export type NoticePriority = 'High' | 'Medium' | 'Low'
export type NoticeSource = 'Automatic' | 'Department Admin'

export interface Notice {
  id: string
  title: string
  department: string
  category: NoticeCategory
  priority: NoticePriority
  status: NoticeStatus
  source: NoticeSource
  date: string
  description: string
  targetCourse?: string
  targetYear?: string
  notificationSent?: boolean
  confidence?: number
}

export const notices: Notice[] = [
  {
    id: '1',
    title: 'BCA 2nd Semester Examination Timetable Updated',
    department: 'BCA',
    category: 'Examination',
    priority: 'High',
    status: 'Published',
    source: 'Automatic',
    date: '15 Aug 2026',
    description:
      'The examination timetable for BCA 2nd Semester has been revised. Students are requested to note the updated schedule carefully. Theory exams commence from 20th August 2026.',
    targetCourse: 'BCA',
    targetYear: '2nd Year',
    notificationSent: true,
    confidence: 94,
  },
  {
    id: '2',
    title: 'University Holiday Circular — Independence Day',
    department: 'Administration',
    category: 'Holiday',
    priority: 'Medium',
    status: 'Published',
    source: 'Department Admin',
    date: '14 Aug 2026',
    description:
      'The university will remain closed on 15th August 2026 on account of Independence Day. All academic activities are suspended for the day.',
    notificationSent: true,
  },
  {
    id: '3',
    title: 'BCA Classroom Timetable Revised — August 2026',
    department: 'BCA',
    category: 'Timetable',
    priority: 'Medium',
    status: 'Published',
    source: 'Department Admin',
    date: '13 Aug 2026',
    description:
      'Classroom allocations for BCA 1st and 3rd semester have been revised due to infrastructure maintenance. Please check the updated timetable on the notice board.',
    targetCourse: 'BCA',
    notificationSent: true,
  },
  {
    id: '4',
    title: 'MCA Admission 2026–27 Last Date Extended',
    department: 'MCA',
    category: 'Admission',
    priority: 'High',
    status: 'Published',
    source: 'Department Admin',
    date: '12 Aug 2026',
    description:
      'The last date for MCA 2026–27 admissions has been extended to 25th August 2026. Interested candidates may apply through the official portal.',
    targetCourse: 'MCA',
    notificationSent: true,
  },
  {
    id: '5',
    title: 'B.Sc IT Practical Examination Schedule',
    department: 'B.Sc IT',
    category: 'Examination',
    priority: 'High',
    status: 'Pending',
    source: 'Department Admin',
    date: '11 Aug 2026',
    description:
      'Practical examination schedule for B.Sc IT 4th and 6th semester students. Exams will be conducted in the IT Lab from 22nd to 28th August 2026.',
    targetCourse: 'B.Sc IT',
    targetYear: '2nd & 3rd Year',
  },
  {
    id: '6',
    title: 'Annual Sports Meet Registration Open',
    department: 'Administration',
    category: 'Event',
    priority: 'Low',
    status: 'Approved',
    source: 'Department Admin',
    date: '10 Aug 2026',
    description:
      'Registrations for the Annual Sports Meet 2026 are now open. Students can register for various sports categories. Last date: 18th August 2026.',
    notificationSent: false,
  },
  {
    id: '7',
    title: 'University Academic Circular — Semester Break',
    department: 'Administration',
    category: 'Academic',
    priority: 'Medium',
    status: 'Published',
    source: 'Automatic',
    date: '09 Aug 2026',
    description:
      'Semester break schedule has been announced. All departments are requested to complete internal evaluations before the break period.',
    notificationSent: true,
    confidence: 87,
  },
  {
    id: '8',
    title: 'Revised BCA 2nd Semester Examination Timetable',
    department: 'BCA',
    category: 'Examination',
    priority: 'High',
    status: 'Pending',
    source: 'Automatic',
    date: '15 Aug 2026',
    description:
      'Auto-detected from DSVV official website. Examination schedule revision notice for BCA 2nd semester students.',
    targetCourse: 'BCA',
    targetYear: '2nd Year',
    confidence: 94,
  },
]

export const departments = [
  { id: '1', name: 'School of Indology (Yoga & Theology)', admin: 'Dr. Rakesh Sharma', notices: 45, status: 'Active' },
  { id: '2', name: 'Department of Psychology', admin: 'Dr. Priya Patel', notices: 32, status: 'Active' },
  { id: '3', name: 'Department of Computer Science & IT', admin: 'Prof. Anil Verma', notices: 28, status: 'Active' },
  { id: '4', name: 'Department of Animation', admin: 'Dr. Sunita Gupta', notices: 15, status: 'Active' },
  { id: '5', name: 'Department of Tourism', admin: 'Prof. Kiran Joshi', notices: 22, status: 'Active' },
  { id: '6', name: 'Department of Journalism & Mass Comm.', admin: 'Mr. Devendra Singh', notices: 19, status: 'Active' },
  { id: '7', name: 'Department of Education', admin: 'Dr. Meena Pandey', notices: 41, status: 'Active' },
  { id: '8', name: 'Department of Indian Languages', admin: 'Dr. Suresh Chandra', notices: 14, status: 'Active' },
  { id: '9', name: 'Ayurveda & Holistic Health', admin: 'Dr. Rajesh Mishra', notices: 27, status: 'Active' },
  { id: '10', name: 'Rural Studies & Sustainability', admin: 'Dr. Amit Kumar', notices: 11, status: 'Active' },
  { id: '11', name: 'Complementary & Alternative Medicine', admin: 'Dr. Vikas Sharma', notices: 16, status: 'Active' },
  { id: '12', name: 'Administration', admin: 'Mr. Ashok Kumar', notices: 53, status: 'Active' },
]

export const notifications = [
  {
    id: '1',
    type: 'urgent',
    title: 'Examination Timetable Updated',
    message: 'BCA 2nd Semester Examination Timetable has been updated.',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'New Circular',
    message: 'University Holiday Circular published for Independence Day.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'Timetable Update',
    message: 'BCA classroom timetable has been revised for August 2026.',
    time: 'Today, 10:30 AM',
    read: true,
  },
  {
    id: '4',
    type: 'info',
    title: 'Admission Deadline Extended',
    message: 'MCA 2026-27 admission deadline extended to 25th August.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    type: 'urgent',
    title: 'Practical Exam Schedule',
    message: 'B.Sc IT practical examination schedule released.',
    time: '2 days ago',
    read: true,
  },
]

export const autoDetectedItems = [
  {
    id: 'auto-1',
    title: 'BCA 2nd Semester Examination Timetable',
    source: 'DSVV Official Website',
    detected: '5 minutes ago',
    status: 'New',
    department: 'BCA',
    category: 'Examination',
    type: 'Timetable',
    priority: 'High',
    confidence: 94,
    excerpt:
      'The examination schedule for BCA 2nd semester has been revised and updated on the official portal...',
  },
  {
    id: 'auto-2',
    title: 'University Academic Circular — Semester Break',
    source: 'DSVV Official Website',
    detected: '15 minutes ago',
    status: 'New',
    department: 'Administration',
    category: 'Academic',
    type: 'Circular',
    priority: 'Medium',
    confidence: 87,
    excerpt:
      'Semester break schedule for all departments has been announced for the academic year 2026-27...',
  },
  {
    id: 'auto-3',
    title: 'Faculty Workshop on Digital Learning Tools',
    source: 'DSVV Official Website',
    detected: '2 hours ago',
    status: 'Reviewing',
    department: 'Administration',
    category: 'Academic',
    type: 'Event',
    priority: 'Low',
    confidence: 72,
    excerpt:
      'A two-day workshop on digital learning and assessment tools will be organized for faculty members...',
  },
]

export const deptStats = {
  totalNotices: 24,
  published: 18,
  pending: 4,
  rejected: 2,
}

export const superStats = {
  totalNotices: 142,
  pendingApproval: 7,
  published: 124,
  autoDetected: 23,
  departments: 6,
  notificationsSent: 1284,
}
