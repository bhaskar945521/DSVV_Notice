import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import AIAnalysisPanel from '../components/AIAnalysisPanel'
import * as noticeService from '../services/noticeService'
import * as aiService from '../services/aiService'
import * as departmentService from '../services/departmentService'
import { IconPDF, IconZap, IconCheck, IconAlertCircle, IconArrowRight } from '../components/icons'

export default function AdminCreateNotice() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Notice')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [importantDate, setImportantDate] = useState('')
  const [targetType, setTargetType] = useState('DEPARTMENT')

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [createdNoticeId, setCreatedNoticeId] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleRunAIAnalysis = async () => {
    if (!title && !description) {
      alert('Please enter title or description first to run AI Analysis.')
      return
    }
    setAnalyzing(true)
    try {
      const res = await aiService.analyzeNotice(createdNoticeId, title, description)
      if (res.success) {
        setAiAnalysis(res.analysis)
        // Auto populate suggestions if desired
        if (res.analysis.categorySuggestion) setCategory(res.analysis.categorySuggestion)
        if (res.analysis.prioritySuggestion) setPriority(res.analysis.prioritySuggestion)
        if (res.analysis.targetTypeSuggestion) setTargetType(res.analysis.targetTypeSuggestion)
      }
    } catch (e) {
      console.warn('AI analysis error:', e)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmitNotice = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // 1. Create notice draft
      const noticeRes = await noticeService.createNotice({
        title,
        description,
        category,
        priority,
        importantDate: importantDate || undefined,
        targetType,
      })

      if (noticeRes.success) {
        const noticeId = noticeRes.notice._id

        // 2. Upload PDF file if selected
        if (selectedFile) {
          await noticeService.uploadNoticeFile(noticeId, selectedFile)
        }

        // 3. Submit notice for approval
        await noticeService.submitNotice(noticeId, 'Submitted from Department Admin dashboard')

        alert('Notice submitted successfully! It is now pending Super Admin approval.')
        navigate('/admin/notices')
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to submit notice.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Create & Submit New Notice</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete notice creation pipeline with automated AI classification & target audience suggestions
          </p>
        </div>

        <form onSubmit={handleSubmitNotice} className="space-y-6">
          {/* Step 1: Notice Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
              1. Basic Notice Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Notice Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. BCA 7th Semester Examination Schedule Revised"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 outline-none bg-white"
                >
                  <option>Examination</option>
                  <option>Timetable</option>
                  <option>Circular</option>
                  <option>Academic</option>
                  <option>Admission</option>
                  <option>Holiday</option>
                  <option>Workshop</option>
                  <option>Event</option>
                  <option>Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 outline-none bg-white"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Notice Description / Details *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter detailed notice content or instructions..."
                className="w-full border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 font-medium outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Important Date / Deadline (Optional)</label>
              <input
                type="date"
                value={importantDate}
                onChange={(e) => setImportantDate(e.target.value)}
                className="w-full sm:w-64 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium bg-white"
              />
            </div>
          </div>

          {/* Step 2: Upload PDF Document */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
              2. Upload Official PDF Document
            </h3>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer bg-slate-50/50">
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" id="pdf-upload" />
              <label htmlFor="pdf-upload" className="cursor-pointer block space-y-2">
                <IconPDF size={32} className="mx-auto text-purple-600" />
                <p className="text-xs font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Click to upload PDF or drag and drop file'}
                </p>
                <p className="text-[11px] text-slate-400">PDF, DOC up to 10MB</p>
              </label>
            </div>
          </div>

          {/* Step 3: Trigger AI Intelligence */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 text-white space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <IconZap size={18} className="text-amber-400" />
                  3. Run AI Content & Audience Analysis
                </h3>
                <p className="text-xs text-purple-200">
                  Extract text, classify category, and suggest intended target audience automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunAIAnalysis}
                disabled={analyzing}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl transition-all shadow-md shrink-0"
              >
                {analyzing ? 'Analyzing...' : 'Run AI Intelligence'}
              </button>
            </div>

            {/* AI Analysis Panel Output */}
            {aiAnalysis && (
              <div className="text-slate-900 mt-4">
                <AIAnalysisPanel
                  analysis={aiAnalysis}
                  onAccept={() => alert('AI suggestions applied to form!')}
                />
              </div>
            )}
          </div>

          {/* Step 4: Target Audience System */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
              4. Target Audience Resolution
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'DEPARTMENT', label: 'Entire Department', desc: 'All students in your department' },
                { type: 'COURSE', label: 'Specific Course', desc: 'e.g. BCA / MCA Students' },
                { type: 'SEMESTER', label: 'Specific Semester', desc: 'e.g. 7th Semester Students' },
                { type: 'UNIVERSITY', label: 'Entire University', desc: 'All active DSVV students' },
              ].map((t) => (
                <div
                  key={t.type}
                  onClick={() => setTargetType(t.type)}
                  className={`p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                    targetType === t.type
                      ? 'border-purple-600 bg-purple-50/60'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{t.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting Notice...' : 'Submit for Super Admin Approval'}
              <IconArrowRight size={16} />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
