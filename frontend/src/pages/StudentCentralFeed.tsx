import { useState, useEffect } from 'react'
import StudentNavbar from '../components/StudentNavbar'
import NoticeCard from '../components/NoticeCard'
import AISummaryModal from '../components/AISummaryModal'
import * as noticeService from '../services/noticeService'
import { IconNotice, IconSearch } from '../components/icons'

export default function StudentCentralFeed() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNotice, setSelectedNotice] = useState<any>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCentral = async () => {
      try {
        setLoading(true)
        const res = await noticeService.getNotices({ central: 'true', search: search || undefined })
        if (res.success) setNotices(res.notices)
      } catch (e) {
        console.warn('Failed to load central notices:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchCentral()
  }, [search])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full uppercase">
                SECONDARY FEED
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Central DSVV Feed</h1>
            <p className="text-xs text-slate-300 mt-1">
              Official university-wide circulars, holiday notices, administration orders, and general announcements.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold text-slate-200">
            {notices.length} Central Circulars
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <IconSearch size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search central university notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none font-medium"
            />
          </div>
        </div>

        {/* Feed List */}
        {loading ? (
          <div className="py-20 text-center text-xs font-medium text-slate-400">Loading central updates...</div>
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
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm">
            No central notices found.
          </div>
        )}
      </main>

      {selectedNotice && (
        <AISummaryModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      )}
    </div>
  )
}
