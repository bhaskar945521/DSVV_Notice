import { useState } from 'react'
import { IconCpu, IconCheck, IconEdit, IconX, IconZap } from './icons'

interface AIAnalysisPanelProps {
  analysis: any
  onAccept?: () => void
  onEdit?: () => void
  onReject?: () => void
}

export default function AIAnalysisPanel({ analysis, onAccept, onEdit, onReject }: AIAnalysisPanelProps) {
  if (!analysis) return null

  const confidence = analysis.confidence || 94
  const keywords = analysis.keywords || ['BCA', 'Examination', 'Schedule', 'Semester', 'DSVV']

  return (
    <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700">
            <IconCpu size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              AI Content Analysis & Intelligence
              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Automated Assistance
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Extracted document structure, category, and target audience recommendation
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">AI Confidence:</span>
            <span className={`text-base font-extrabold ${confidence >= 85 ? 'text-green-600' : 'text-amber-600'}`}>
              {confidence}%
            </span>
          </div>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full ${confidence >= 85 ? 'bg-green-500' : 'bg-amber-500'}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Extracted Key Terms</p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw: string, i: number) => (
              <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200/80 rounded-lg text-xs font-semibold">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grid classification */}
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">AI Classification & Audience Recommendation</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <p className="text-[10px] font-medium text-slate-400">Department</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{analysis.departmentSuggestion || 'Computer Science'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <p className="text-[10px] font-medium text-slate-400">Category</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{analysis.categorySuggestion || 'Examination'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <p className="text-[10px] font-medium text-slate-400">Priority</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{analysis.prioritySuggestion || 'High'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <p className="text-[10px] font-medium text-slate-400">Target Course</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{analysis.courseSuggestion || 'BCA'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <p className="text-[10px] font-medium text-slate-400">Target Semester</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{analysis.semesterSuggestion || '2nd Semester'}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
            <p className="text-[10px] font-medium text-purple-700 font-bold">Suggested Audience</p>
            <p className="text-xs font-extrabold text-purple-900 mt-0.5">{analysis.audienceSuggestion || 'BCA 2nd Semester'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        {onAccept && (
          <button
            onClick={onAccept}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <IconCheck size={14} />
            Accept AI Suggestions
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
          >
            <IconEdit size={14} />
            Modify Classification
          </button>
        )}
        {onReject && (
          <button
            onClick={onReject}
            className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors"
          >
            <IconX size={14} />
            Reject AI Analysis
          </button>
        )}
      </div>
    </div>
  )
}
