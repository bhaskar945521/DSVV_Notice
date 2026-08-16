import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StudentNavbar from '../components/StudentNavbar'
import NoticeCard from '../components/NoticeCard'
import AISummaryModal from '../components/AISummaryModal'
import { useAuth } from '../context/AuthContext'
import * as noticeService from '../services/noticeService'
import * as departmentService from '../services/departmentService'
import { IconNotice, IconZap, IconCalendar, IconBell, IconChevronRight, IconSearch } from '../components/icons'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [deptNotices, setDeptNotices] = useState<any[]>([])
  const [centralNotices, setCentralNotices] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNotice, setSelectedNotice] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [deptRes, centralRes, annRes] = await Promise.all([
          noticeService.getNotices({ limit: 4 }),
          noticeService.getNotices({ central: 'true', limit: 3 }),
          departmentService.getAnnouncements()
        ])
        if (deptRes.success) setDeptNotices(deptRes.notices)
        if (centralRes.success) setCentralNotices(centralRes.notices)
        if (annRes.success) setAnnouncements(annRes.announcements)
      } catch (e) {
        console.warn('Dashboard data fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <StudentNavbar />

      {/* Marquee Announcement Strip */}
      {announcements.length > 0 && (
        <div className="bg-amber-500 text-amber-950 font-bold text-xs py-2 px-4 flex items-center justify-center gap-3 overflow-hidden shadow-inner">
          <span className="bg-amber-950 text-amber-100 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold shrink-0">
            Important Announcement
          </span>
          <div className="truncate">{announcements[0].text}</div>
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Welcome & Department Identity Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Department: {user?.departmentId?.name || 'Computer Science & IT'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {user?.name || 'Rahul Sharma'} 👋
            </h1>
            <p className="text-blue-100/80 text-xs sm:text-sm max-w-xl">
              Course: <span className="font-bold text-white">{user?.courseId?.name || 'BCA'}</span> • Year/Semester:{' '}
              <span className="font-bold text-white">{user?.semesterId?.label || '2nd Semester'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <Link
              to="/student/search"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all"
            >
              <IconSearch size={15} />
              Search Notices
            </Link>
            <Link
              to="/student/feed"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 transition-all"
            >
              Go to Department Feed
              <IconChevronRight size={15} />
            </Link>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PRIMARY: Departmental Feed (Left Column 8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-700" />
                  Departmental Feed
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
                    PRIMARY
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Targeted notices for {user?.departmentId?.name || 'your department'}
                </p>
              </div>
              <Link to="/student/feed" className="text-xs font-bold text-blue-700 hover:text-blue-900">
                View All Department Notices →
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading departmental updates...</div>
            ) : deptNotices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deptNotices.map((notice) => (
                  <NoticeCard
                    key={notice._id || notice.id}
                    notice={notice}
                    onSummarize={() => setSelectedNotice(notice)}
                    onView={() => setSelectedNotice(notice)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No recent departmental notices found.
              </div>
            )}

            {/* SECONDARY: Central DSVV Feed Preview */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    Central DSVV Updates
                    <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase">
                      SECONDARY
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">University-wide circulars, holidays & announcements</p>
                </div>
                <Link to="/student/central" className="text-xs font-bold text-slate-600 hover:text-slate-900">
                  View Central Feed →
                </Link>
              </div>

              <div className="space-y-3">
                {centralNotices.map((notice) => (
                  <div
                    key={notice._id || notice.id}
                    onClick={() => setSelectedNotice(notice)}
                    className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-xl p-4 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {notice.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString() : 'Today'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {notice.title}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-blue-600 shrink-0">View →</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Quick Summary Banner */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-5 text-white space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                <IconZap size={15} />
                AI Quick Brief
              </div>
              <p className="text-xs text-purple-100 leading-relaxed">
                Understand 10+ page official university circulars in 20 seconds. Click "AI Summarize" on any notice card.
              </p>
            </div>

            {/* Upcoming Important Dates Timeline Widget */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <IconCalendar size={16} className="text-amber-500" />
                Upcoming Important Dates
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl">
                  <div className="w-10 h-10 bg-amber-200 text-amber-900 font-extrabold text-xs rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span>20</span>
                    <span className="text-[9px] uppercase font-bold">AUG</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-950">BCA 2nd Sem Theory Exams</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">Commence from 20th August 2026</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 bg-blue-50 border border-blue-200/80 rounded-xl">
                  <div className="w-10 h-10 bg-blue-200 text-blue-900 font-extrabold text-xs rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span>25</span>
                    <span className="text-[9px] uppercase font-bold">AUG</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-950">Yogic Workshop Registration</p>
                    <p className="text-[11px] text-blue-800 mt-0.5">Last date for submission</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Source Guarantee */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Trusted Aggregator</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Directly aggregated from verified DSVV departments and dsvv.ac.in official servers with human verification.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* AI Summary Popup Modal */}
      {selectedNotice && (
        <AISummaryModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      )}
    </div>
  )
}
