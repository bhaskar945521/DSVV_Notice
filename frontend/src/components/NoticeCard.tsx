import { useState } from 'react'
import { IconPDF, IconChevronRight, IconZap, IconBookmark, IconEye } from './icons'

interface NoticeCardProps {
  notice: any
  onSummarize?: () => void
  onView?: () => void
  onSave?: () => void
  isSaved?: boolean
}

export default function NoticeCard({ notice, onSummarize, onView, onSave, isSaved }: NoticeCardProps) {
  const departmentName = notice.departmentId?.name || notice.department || 'University Notice'
  const category = notice.category || 'Notice'
  const priority = notice.priority || 'Medium'

  const categoryStyles: Record<string, string> = {
    Examination: 'bg-red-50 text-red-700 border-red-200',
    Timetable: 'bg-purple-50 text-purple-700 border-purple-200',
    Circular: 'bg-sky-50 text-sky-700 border-sky-200',
    Academic: 'bg-blue-50 text-blue-700 border-blue-200',
    Admission: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Holiday: 'bg-amber-50 text-amber-700 border-amber-200',
    Event: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Workshop: 'bg-violet-50 text-violet-700 border-violet-200',
    Notice: 'bg-slate-50 text-slate-600 border-slate-200',
  }

  const badgeStyle = categoryStyles[category] || categoryStyles.Notice

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
              {category}
            </span>
            {priority === 'High' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                High Priority
              </span>
            )}
            {notice.isCentral && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                Central DSVV
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
              <IconZap size={11} />
              AI Verified
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onSave && (
              <button
                onClick={onSave}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Saved' : 'Save Notice'}
              >
                <IconBookmark size={15} />
              </button>
            )}
            <div className="flex items-center gap-1 text-slate-400 text-xs px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <IconPDF size={14} className="text-red-500" />
              <span>PDF</span>
            </div>
          </div>
        </div>

        {/* Notice Title */}
        <h3
          onClick={onView}
          className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors cursor-pointer"
        >
          {notice.title}
        </h3>

        {/* Short Description */}
        <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2">
          {notice.description}
        </p>
      </div>

      <div>
        {/* Department & Date Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{departmentName}</span>
            <span>•</span>
            <span>{notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString() : notice.date || 'Recent'}</span>
          </div>
          {notice.importantDate && (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200/60">
              Due: {new Date(notice.importantDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {onSummarize && (
            <button
              onClick={onSummarize}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-xl text-xs font-semibold transition-colors"
            >
              <IconZap size={13} />
              AI Summarize
            </button>
          )}
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-700 text-white hover:bg-blue-800 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <IconEye size={13} />
            View Notice
          </button>
        </div>
      </div>
    </div>
  )
}
