import { useState } from 'react'
import StudentNavbar from '../components/StudentNavbar'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import { IconUser, IconCheck, IconLogOut } from '../components/icons'

export default function StudentProfile() {
  const { user, logout } = useAuth()
  const [prefs, setPrefs] = useState({
    examination: user?.notificationPreferences?.examination ?? true,
    timetable: user?.notificationPreferences?.timetable ?? true,
    department: user?.notificationPreferences?.department ?? true,
    circular: user?.notificationPreferences?.circular ?? true,
    events: user?.notificationPreferences?.events ?? false,
    aiSummaryEnabled: user?.notificationPreferences?.aiSummaryEnabled ?? true,
  })
  const [savedMsg, setSavedMsg] = useState(false)

  const handleToggle = async (key: string) => {
    const updated = { ...prefs, [key]: !prefs[key as keyof typeof prefs] }
    setPrefs(updated)
    try {
      await API.patch('/users/preferences', updated)
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2000)
    } catch (e) {
      console.warn('Failed to save preferences:', e)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <StudentNavbar />

      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Student Profile & Preferences</h1>

        {/* Identity Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="w-16 h-16 bg-blue-100 border-2 border-blue-200 text-blue-800 rounded-2xl flex items-center justify-center font-black text-xl">
              {user?.name?.substring(0, 2).toUpperCase() || 'ST'}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{user?.name || 'Rahul Sharma'}</h2>
              <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase">
                Verified Student Identity
              </span>
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Enrollment No.</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{user?.studentId || 'DSVV/BCA/2024/042'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Department</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{user?.departmentId?.name || 'Computer Science'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Course</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{user?.courseId?.name || 'BCA'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Semester</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{user?.semesterId?.label || '2nd Semester'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Section</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">Section A</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
              <p className="text-xs font-bold text-green-600 mt-0.5">Active Student</p>
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Notification & AI Preferences</h3>
              <p className="text-xs text-slate-500">Configure which updates and AI assistance features you receive</p>
            </div>
            {savedMsg && (
              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full animate-fadeIn">
                Saved ✓
              </span>
            )}
          </div>

          <div className="space-y-3">
            {[
              { key: 'examination', label: 'Examination & Timetable Alerts', desc: 'Receive high priority exam revisions' },
              { key: 'timetable', label: 'Classroom Timetable Changes', desc: 'Alerts when department reschedules lectures' },
              { key: 'department', label: 'Department Notices', desc: 'Direct notices from your department HOD' },
              { key: 'circular', label: 'Important Central Circulars', desc: 'University-wide general circulars & holidays' },
              { key: 'aiSummaryEnabled', label: 'AI Quick Summary Auto-Preview', desc: 'Generate 20-sec summary previews automatically' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs[item.key as keyof typeof prefs]}
                  onChange={() => handleToggle(item.key)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs rounded-2xl transition-colors"
          >
            <IconLogOut size={16} />
            Logout Account
          </button>
        </div>
      </main>
    </div>
  )
}
