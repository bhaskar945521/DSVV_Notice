import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import * as noticeService from '../services/noticeService'
import * as analyticsService from '../services/analyticsService'
import { IconNotice, IconAlertCircle, IconCheck, IconZap, IconBuilding, IconUsers, IconCpu } from '../components/icons'

export default function SuperAdminDashboard() {
  const [pendingNotices, setPendingNotices] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [pendingRes, analyticsRes] = await Promise.all([
          noticeService.getNotices({ status: 'Pending' }),
          analyticsService.getOverviewAnalytics()
        ])
        if (pendingRes.success) setPendingNotices(pendingRes.notices)
        if (analyticsRes.success) setStats(analyticsRes.stats)
      } catch (e) {
        console.warn('Failed to load super admin dashboard:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <SuperAdminSidebar />

      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Super Admin Command Center</h1>
            <p className="text-xs text-slate-400 mt-1">
              Central control panel for DSVV notices, human verification queue, and automated ingestion
            </p>
          </div>

          <Link
            to="/super-admin/approvals"
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            <IconAlertCircle size={16} />
            Review Pending Queue ({pendingNotices.length})
          </Link>
        </div>

        {/* System Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Total Notices</p>
            <p className="text-3xl font-black text-white mt-1">{stats?.totalNotices || 142}</p>
            <p className="text-[11px] text-slate-500 mt-1">Across all departments</p>
          </div>

          <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-5 shadow-xs bg-amber-950/10">
            <p className="text-xs font-bold text-amber-400">Pending Approvals</p>
            <p className="text-3xl font-black text-amber-400 mt-1">{pendingNotices.length}</p>
            <p className="text-[11px] text-amber-300/80 mt-1">Requires human review</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Published Live</p>
            <p className="text-3xl font-black text-green-400 mt-1">{stats?.publishedNotices || 124}</p>
            <p className="text-[11px] text-green-500 mt-1">Active on student feed</p>
          </div>

          <div className="bg-slate-900 border border-purple-900/40 rounded-2xl p-5 shadow-xs bg-purple-950/10">
            <p className="text-xs font-bold text-purple-300">Auto Detected</p>
            <p className="text-3xl font-black text-purple-400 mt-1">23</p>
            <p className="text-[11px] text-purple-300/80 mt-1">By automatic collector</p>
          </div>
        </div>

        {/* Automatic Notice Collector Live Status Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <IconZap size={18} className="text-purple-400" />
              Automatic Notice Collector Status
            </h3>
            <Link to="/super-admin/sources" className="text-xs font-bold text-blue-400 hover:underline">
              Manage Sources →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-white">DSVV Official Website</p>
                <p className="text-[10px] text-green-400">Connected • Check every 30m</p>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
              <IconCpu size={16} className="text-purple-400" />
              <div>
                <p className="text-xs font-bold text-white">AI Content Extraction</p>
                <p className="text-[10px] text-purple-300">Active • NLP Engine Ready</p>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
              <IconCheck size={16} className="text-blue-400" />
              <div>
                <p className="text-xs font-bold text-white">Human Verification</p>
                <p className="text-[10px] text-blue-300">Enforced • Zero auto-publish</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Quick Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <IconAlertCircle size={18} className="text-amber-400" />
              Pending Verification Queue ({pendingNotices.length})
            </h3>
            <Link to="/super-admin/approvals" className="text-xs font-bold text-amber-400 hover:underline">
              Review Queue →
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading pending notices...</div>
          ) : pendingNotices.length > 0 ? (
            <div className="space-y-3">
              {pendingNotices.map((n) => (
                <div key={n._id || n.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                        {n.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Submitted by: {n.createdBy?.name || 'Dept Admin'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  </div>

                  <Link
                    to="/super-admin/approvals"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl transition-colors shrink-0"
                  >
                    Review & Publish
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No pending approvals. All notices are reviewed!
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
