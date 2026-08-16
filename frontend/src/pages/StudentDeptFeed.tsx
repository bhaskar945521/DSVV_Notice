import { useState, useEffect } from 'react'
import StudentNavbar from '../components/StudentNavbar'
import NoticeCard from '../components/NoticeCard'
import AISummaryModal from '../components/AISummaryModal'
import { useAuth } from '../context/AuthContext'
import * as noticeService from '../services/noticeService'
import { IconNotice, IconFilter, IconSearch } from '../components/icons'

export default function StudentDeptFeed() {
  const { user } = useAuth()
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')
  const [selectedNotice, setSelectedNotice] = useState<any>(null)

  useEffect(() => {
    const fetchDeptNotices = async () => {
      try {
        setLoading(true)
        const res = await noticeService.getNotices({
          category: selectedCategory || undefined,
          search: search || undefined,
        })
        if (res.success) {
          setNotices(res.notices)
        }
      } catch (e) {
        console.warn('Failed to load dept notices:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchDeptNotices()
  }, [selectedCategory, search])

  const categories = ['All', 'Examination', 'Timetable', 'Academic', 'Assignment', 'Workshop', 'Event']

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-blue-700" />
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
                PRIMARY STUDENT FEED
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {user?.departmentId?.name || 'Department'} Feed
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Notices, timetables, and academic updates specifically targeted for {user?.courseId?.name || 'your course'}.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-600">
            <IconNotice size={16} className="text-blue-600" />
            <span className="font-bold text-slate-900">{notices.length}</span> notices found
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <IconSearch size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search in your departmental notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none font-medium placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
              <IconFilter size={13} /> Filter:
            </span>
            {categories.map((cat) => {
              const isActive = (cat === 'All' && !selectedCategory) || selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Feed List */}
        {loading ? (
          <div className="py-20 text-center text-xs font-medium text-slate-400">
            Loading departmental notices...
          </div>
        ) : notices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice) => (
              <NoticeCard
                key={notice._id || notice.id}
                notice={notice}
                onSummarize={() => setSelectedNotice(notice)}
                onView={() => setSelectedNotice(notice)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <IconNotice size={36} className="mx-auto text-slate-300" />
            <p className="font-bold text-slate-700">No departmental notices found</p>
            <p className="text-xs">Try clearing filters or search query.</p>
          </div>
        )}
      </main>

      {selectedNotice && (
        <AISummaryModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      )}
    </div>
  )
}
