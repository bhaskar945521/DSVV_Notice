import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import * as analyticsService from '../services/analyticsService'
import { IconCpu } from '../components/icons'

export default function SuperAdminAnalytics() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    analyticsService.getOverviewAnalytics().then(res => {
      if (res.success) setStats(res.stats)
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <SuperAdminSidebar />
      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <IconCpu size={24} className="text-purple-500" />
            System-Wide Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">Aggregated platform engagement metrics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400">Total System Views</p>
            <p className="text-4xl font-black text-white mt-2">{stats?.totalViews || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400">AI Summaries Generated</p>
            <p className="text-4xl font-black text-purple-400 mt-2">{stats?.totalSummaries || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400">Platform View Rate</p>
            <p className="text-4xl font-black text-green-400 mt-2">{stats?.avgViewRate || 0}%</p>
          </div>
        </div>
      </main>
    </div>
  )
}
