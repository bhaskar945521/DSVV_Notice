import { useState, useEffect } from 'react'
import StudentNavbar from '../components/StudentNavbar'
import NoticeCard from '../components/NoticeCard'
import AISummaryModal from '../components/AISummaryModal'
import * as noticeService from '../services/noticeService'
import { IconBookmark } from '../components/icons'

export default function StudentSaved() {
  const [savedNotices, setSavedNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNotice, setSelectedNotice] = useState<any>(null)

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true)
        const res = await noticeService.getSavedNotices()
        if (res.success) setSavedNotices(res.notices)
      } catch (e) {
        console.warn('Failed to load saved notices:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchSaved()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <IconBookmark size={24} className="text-amber-500" />
              Saved Notices & Bookmarks
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Quick access to notices you have bookmarked for later</p>
          </div>

          <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
            {savedNotices.length} Saved
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading saved notices...</div>
        ) : savedNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedNotices.map((notice) => (
              <NoticeCard
                key={notice._id || notice.id}
                notice={notice}
                isSaved={true}
                onSummarize={() => setSelectedNotice(notice)}
                onView={() => setSelectedNotice(notice)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <IconBookmark size={36} className="mx-auto text-slate-300" />
            <p className="font-bold text-slate-700">No saved notices yet</p>
            <p className="text-xs">Click the bookmark icon on any notice card to save it here.</p>
          </div>
        )}
      </main>

      {selectedNotice && (
        <AISummaryModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      )}
    </div>
  )
}
