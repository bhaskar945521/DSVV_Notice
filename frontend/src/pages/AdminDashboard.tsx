import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import { useAuth } from '../context/AuthContext'
import * as noticeService from '../services/noticeService'
import { IconNotice, IconPlus, IconAlertCircle, IconCheck, IconEye, IconPDF } from '../components/icons'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        const res = await noticeService.getNotices({ limit: 10 })
        if (res.success) setNotices(res.notices)
      } catch (e) {
        console.warn('Failed to fetch admin notices:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  const stats = {
    total: notices.length,
    published: notices.filter((n) => n.status === 'Published').length,
    pending: notices.filter((n) => n.status === 'Pending').length,
    rejected: notices.filter((n) => n.status === 'Rejected').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {user?.departmentId?.name || 'Department'} Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create, review, and track departmental notices for students
            </p>
          </div>

          <Link
            to="/admin/notices/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            <IconPlus size={16} />
            Create New Notice
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-bold text-slate-500">Total Notices</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats.total}</p>
            <p className="text-[11px] text-slate-400 mt-1">All time</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-bold text-slate-500">Published</p>
            <p className="text-3xl font-black text-green-600 mt-1">{stats.published}</p>
            <p className="text-[11px] text-green-700 mt-1">Live on student feed</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-bold text-slate-500">Pending Approval</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{stats.pending}</p>
            <p className="text-[11px] text-amber-700 mt-1">Awaiting Super Admin</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-bold text-slate-500">Rejected / Revision</p>
            <p className="text-3xl font-black text-red-600 mt-1">{stats.rejected}</p>
            <p className="text-[11px] text-red-700 mt-1">Action required</p>
          </div>
        </div>

        {/* Recent Notices Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-sm">Recent Department Notices</h2>
            <Link to="/admin/notices" className="text-xs font-bold text-purple-700 hover:underline">
              View All Notices →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading notices...</div>
          ) : notices.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {notices.map((n) => (
                <div key={n._id || n.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                      <IconPDF size={18} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{n.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {n.category} • {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : 'Draft'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                        n.status === 'Published'
                          ? 'bg-green-100 text-green-800'
                          : n.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {n.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">No notices created yet.</div>
          )}
        </div>
      </main>
    </div>
  )
}
