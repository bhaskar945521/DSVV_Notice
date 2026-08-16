import { useState, useEffect } from 'react'
import { IconPDF, IconX, IconCheck, IconZap } from './icons'
import * as aiService from '../services/aiService'
import * as noticeService from '../services/noticeService'

interface AISummaryModalProps {
  notice: any
  onClose: () => void
}

export default function AISummaryModal({ notice, onClose }: AISummaryModalProps) {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true)
        const res = await aiService.summarizeNotice(notice._id || notice.id, notice.title, notice.description)
        if (res.success) {
          setSummary(res.summary)
          // Track event
          noticeService.trackNoticeEvent(notice._id || notice.id, 'SUMMARIZED')
        }
      } catch (e) {
        console.warn('AI Summary fetch failed:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [notice])

  const openOriginalPdf = () => {
    if (notice.fileUrl) {
      window.open(`http://localhost:5000${notice.fileUrl}`, '_blank')
    } else {
      alert('Original document preview is available in the detailed notice view.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-purple-300">
              <IconZap size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                AI Notice Summary
                <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-full font-mono">
                  Assistive Layer
                </span>
              </h3>
              <p className="text-xs text-purple-200/80 line-clamp-1 mt-0.5">{notice.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-slate-500">AI is understanding and summarizing notice...</p>
            </div>
          ) : summary ? (
            <>
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-purple-50/60 border border-purple-100 p-3.5 rounded-xl">
                  {summary.overview}
                </p>
              </div>

              {/* Key Points */}
              {summary.keyPoints?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Points</h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Important Date & Action Required */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5">
                  <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">📅 Important Date</p>
                  <p className="text-xs font-semibold text-amber-950 mt-1">
                    {summary.importantDate || notice.importantDate ? new Date(notice.importantDate || summary.importantDate).toLocaleDateString() : 'See original document'}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3.5">
                  <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">⚡ Action Required</p>
                  <p className="text-xs font-semibold text-blue-950 mt-1">
                    {summary.actionRequired || 'Read carefully and mark important deadlines.'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 leading-relaxed">
                ⚠️ <strong>Note:</strong> AI summary is an assistive preview only. The official document below remains the authoritative source of truth.
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">Could not generate summary.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
          <button
            onClick={openOriginalPdf}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors shadow-md shadow-blue-200"
          >
            <IconPDF size={15} />
            View Original Notice
          </button>
        </div>
      </div>
    </div>
  )
}
