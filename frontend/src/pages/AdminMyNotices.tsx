import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import * as noticeService from '../services/noticeService'
import { IconNotice, IconEye, IconPDF } from '../components/icons'

export default function AdminMyNotices() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        const res = await noticeService.getNotices({ limit: 50 })
        if (res.success) setNotices(res.notices)
      } catch (e) {
        console.warn('Failed to load notices:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Department Notices</h1>
            <p className="text-xs text-slate-500 mt-1">Full notice inventory and approval tracking</p>
          </div>

          <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
            {notices.length} Notices
          </span>
        </div>

        {/* Notices Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading notices...</div>
          ) : notices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Target</th>
                    <th className="p-4">Published Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {notices.map((n) => (
                    <tr key={n._id || n.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{n.title}</td>
                      <td className="p-4">{n.category}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${n.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                          {n.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          n.status === 'Published' ? 'bg-green-100 text-green-800' :
                          n.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {n.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-purple-700">{n.targetType || 'DEPARTMENT'}</td>
                      <td className="p-4 text-slate-500">
                        {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : 'Draft'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">No notices found.</div>
          )}
        </div>
      </main>
    </div>
  )
}
