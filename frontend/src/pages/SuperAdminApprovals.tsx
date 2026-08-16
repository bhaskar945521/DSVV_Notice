import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import AIAnalysisPanel from '../components/AIAnalysisPanel'
import * as noticeService from '../services/noticeService'
import { IconCheck, IconX, IconEdit, IconAlertCircle } from '../components/icons'

export default function SuperAdminApprovals() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const fetchPending = async () => {
    try {
      setLoading(true)
      const res = await noticeService.getNotices({ status: 'Pending' })
      if (res.success) setNotices(res.notices)
    } catch (e) {
      console.warn('Failed to load pending notices:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await noticeService.approveNotice(id, 'Approved by Super Admin')
      alert('Notice approved & published! Notifications sent to targeted students.')
      fetchPending()
    } catch (e: any) {
      alert(e.response?.data?.message || 'Approval failed.')
    }
  }

  const handleRejectSubmit = async () => {
    if (!rejectingId || !rejectReason) return
    try {
      await noticeService.rejectNotice(rejectingId, rejectReason, 'Rejected during Super Admin review')
      alert('Notice rejected.')
      setRejectingId(null)
      setRejectReason('')
      fetchPending()
    } catch (e: any) {
      alert(e.response?.data?.message || 'Rejection failed.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <SuperAdminSidebar />

      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <IconAlertCircle size={24} className="text-amber-400" />
            Human Verification Queue (Pending Approvals)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Human-in-the-loop principle: AI assists with classification & audience suggestions, but Super Admin retains final publishing control.
          </p>
        </div>

        {/* Notices Queue */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading verification queue...</div>
        ) : notices.length > 0 ? (
          <div className="space-y-6">
            {notices.map((n) => (
              <div key={n._id || n.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase">
                        Pending Approval
                      </span>
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">
                        {n.category}
                      </span>
                      <span className="text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/40 px-2.5 py-0.5 rounded-full">
                        Target: {n.targetType || 'DEPARTMENT'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{n.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{n.description}</p>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Department</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{n.departmentId?.name || 'Computer Science'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Priority</p>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">{n.priority || 'Medium'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Submitted By</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{n.createdBy?.name || 'Dept Admin'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Submission Date</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>

                {/* Embedded AI Analysis Panel */}
                <div className="text-slate-900">
                  <AIAnalysisPanel analysis={n.aiAnalysisId || { confidence: 94, keywords: ['DSVV', 'Examination'] }} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleApprove(n._id || n.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-green-600/20 transition-all"
                  >
                    <IconCheck size={16} />
                    Approve & Publish to Target Feed
                  </button>

                  <button
                    onClick={() => setRejectingId(n._id || n.id)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-xs rounded-xl transition-all"
                  >
                    <IconX size={16} />
                    Reject Notice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
            Verification queue is clear. No pending notices.
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Specify Rejection Reason</h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Schedule conflicts with Central University Sports Meet..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-red-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setRejectingId(null)} className="px-4 py-2 text-xs font-semibold text-slate-400">
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
