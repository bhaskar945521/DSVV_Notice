import { useState, useEffect } from 'react'
import StudentNavbar from '../components/StudentNavbar'
import NoticeCard from '../components/NoticeCard'
import AISummaryModal from '../components/AISummaryModal'
import * as noticeService from '../services/noticeService'
import * as departmentService from '../services/departmentService'
import { IconSearch, IconFilter, IconX } from '../components/icons'

export default function StudentSearch() {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [departments, setDepartments] = useState<any[]>([])
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState<any>(null)

  useEffect(() => {
    departmentService.getDepartments().then((res) => {
      if (res.success) setDepartments(res.departments)
    })
  }, [])

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true)
      try {
        const res = await noticeService.getNotices({
          search: query || undefined,
          department: department || undefined,
          category: category || undefined,
          priority: priority || undefined,
        })
        if (res.success) setNotices(res.notices)
      } catch (e) {
        console.warn('Search fetch error:', e)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchSearch()
    }, 300)

    return () => clearTimeout(timer)
  }, [query, department, category, priority])

  const clearFilters = () => {
    setQuery('')
    setDepartment('')
    setCategory('')
    setPriority('')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Search & Discover Notices</h1>

        {/* Debounced Search Input */}
        <div className="flex items-center gap-3 bg-white border-2 border-blue-300 focus-within:border-blue-600 rounded-2xl px-4 py-3.5 shadow-sm transition-all">
          <IconSearch size={22} className="text-blue-500 shrink-0" />
          <input
            type="text"
            placeholder="Type notice title, topic, timetable, or examination key term..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <IconX size={18} />
            </button>
          )}
        </div>

        {/* Search Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters Column (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 h-fit space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <IconFilter size={15} /> Advanced Filters
              </h3>
              {(query || department || category || priority) && (
                <button onClick={clearFilters} className="text-xs font-bold text-blue-700 hover:underline">
                  Clear All
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
              >
                <option value="">All Categories</option>
                <option>Examination</option>
                <option>Timetable</option>
                <option>Circular</option>
                <option>Academic</option>
                <option>Admission</option>
                <option>Holiday</option>
                <option>Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
              >
                <option value="">All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Results Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <p className="text-xs font-bold text-slate-500">
              Found <span className="text-slate-900">{notices.length}</span> matching notices
            </p>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Searching notices...</div>
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
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
                No matching notices found.
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedNotice && (
        <AISummaryModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      )}
    </div>
  )
}
