import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import * as noticeService from '../services/noticeService'
import { IconNotice, IconFilter } from '../components/icons'

export default function SuperAdminAllNotices() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const res = await noticeService.getNotices({ all: 'true' })
        if (res.success) setNotices(res.notices)
      } catch (e) {
        console.warn('Failed to fetch all notices:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <SuperAdminSidebar />

      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">All System Notices</h1>
            <p className="text-xs text-slate-400 mt-1">Complete system-wide notice ledger across all departments</p>
          </div>

          <span className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
            {notices.length} Total Notices
          </span>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading notices...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Target Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {notices.map((n) => (
                    <tr key={n._id || n.id} className="hover:bg-slate-850 transition-colors">
                      <td className="p-4 font-bold text-white max-w-xs truncate">{n.title}</td>
                      <td className="p-4">{n.departmentId?.name || 'General'}</td>
                      <td className="p-4">{n.category}</td>
                      <td className="p-4">{n.priority}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
                          n.status === 'Published' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          n.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {n.status}
                        </span>
                      </td>
                      <td className="p-4 text-purple-400 font-bold">{n.targetType || 'UNIVERSITY'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
