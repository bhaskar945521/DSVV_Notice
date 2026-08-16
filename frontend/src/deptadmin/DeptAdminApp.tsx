import { useState } from 'react'
import {
  IconDashboard,
  IconNotice,
  IconTimetable,
  IconCircular,
  IconBell,
  IconUser,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconCheck,
  IconX,
  IconLogOut,
  IconAlertCircle,
  IconPDF,
} from '../components/icons'
import { notices as allNotices, deptStats, type Notice, type NoticeStatus } from '../data'

type Screen = 'dashboard' | 'add' | 'my-notices' | 'pending'

function Badge({
  label,
  variant,
}: {
  label: string
  variant: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray' | 'blue'
}) {
  const styles = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray: 'bg-slate-50 text-slate-600 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {label}
    </span>
  )
}

function statusVariant(s: NoticeStatus): 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray' | 'blue' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray' | 'blue'> = {
    Draft: 'gray',
    Pending: 'warning',
    Approved: 'blue',
    Published: 'success',
    Rejected: 'danger',
  }
  return map[s] ?? 'gray'
}

function Sidebar({ screen, setScreen, onLogout }: { screen: Screen; setScreen: (s: Screen) => void; onLogout: () => void }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard size={17} /> },
    { id: 'add', label: 'Add Notice', icon: <IconPlus size={17} /> },
    { id: 'my-notices', label: 'My Notices', icon: <IconNotice size={17} /> },
    { id: 'dashboard', label: 'Timetable', icon: <IconTimetable size={17} /> },
    { id: 'dashboard', label: 'Circulars', icon: <IconCircular size={17} /> },
    { id: 'pending', label: 'Pending', icon: <IconAlertCircle size={17} />, badge: deptStats.pending },
    { id: 'dashboard', label: 'Notifications', icon: <IconBell size={17} /> },
    { id: 'dashboard', label: 'Profile', icon: <IconUser size={17} /> },
  ]

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">D</span>
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">DSVV Updates</div>
            <div className="text-slate-400 text-[10px]">Dept Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <div className="bg-blue-50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-blue-400 font-medium">SIGNED IN AS</p>
          <p className="text-xs font-semibold text-blue-800 mt-0.5">CS Dept Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setScreen(item.id as Screen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
              screen === item.id && item.id !== 'dashboard' || (screen === 'dashboard' && item.id === 'dashboard' && i === 0)
                ? 'bg-blue-700 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${screen === item.id ? 'bg-white/20 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 pb-5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <IconLogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

function DashboardScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const myNotices = allNotices.filter((n) => n.department === 'BCA')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Computer Science Department Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track your department notices</p>
        </div>
        <button
          onClick={() => setScreen('add')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          <IconPlus size={16} />
          Add Notice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Notices" value={deptStats.totalNotices} color="text-slate-900" sub="All time" />
        <StatCard label="Published" value={deptStats.published} color="text-green-600" sub="Live on student feed" />
        <StatCard label="Pending Approval" value={deptStats.pending} color="text-yellow-600" sub="Awaiting Super Admin" />
        <StatCard label="Rejected" value={deptStats.rejected} color="text-red-600" sub="Need revision" />
      </div>

      {/* Recent notices */}
      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Recent Notices</h2>
          <button onClick={() => setScreen('my-notices')} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            View all →
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {myNotices.slice(0, 4).map((notice) => (
            <div key={notice.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <IconPDF size={16} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{notice.title}</p>
                  <p className="text-[11px] text-slate-400">{notice.category} · {notice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <Badge label={notice.status} variant={statusVariant(notice.status)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AddNoticeScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    department:' Computer Science',
    category: 'Notice',
    type: 'General',
    course: '',
    year: '',
    priority: 'Medium',
    publishDate: '',
    notify: true,
  })

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <IconCheck size={28} className="text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Notice Submitted Successfully</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Your notice is now waiting for Super Admin approval. You'll be notified once it's reviewed.
        </p>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3">
          <p className="text-yellow-700 text-sm font-medium flex items-center gap-2">
            <IconAlertCircle size={15} />
            Status: Pending Approval
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => { setSubmitted(false); setForm({ ...form, title: '', description: '' }) }}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
          >
            Add Another
          </button>
          <button
            onClick={() => setScreen('my-notices')}
            className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800"
          >
            View My Notices
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Add New Notice</h1>
        <p className="text-sm text-slate-500 mt-0.5">Create a notice for Computer Science Department students</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Notice Title *</label>
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
            placeholder="Enter notice title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description *</label>
          <textarea
            rows={4}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all resize-none"
            placeholder="Detailed notice description…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
            <input
              className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              value="BCA"
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category *</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 bg-white"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {['Notice', 'Circular', 'Examination', 'Timetable', 'Academic', 'Admission', 'Holiday', 'Event', 'Other'].map(
                (c) => <option key={c}>{c}</option>
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Course</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 bg-white"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
            >
              <option value="">All Courses</option>
              <option>BCA</option>
              <option>B.Sc IT</option>
              <option>MCA</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Year</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 bg-white"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              <option value="">All Years</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 bg-white"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Publish Date</label>
            <input
              type="date"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 bg-white"
              value={form.publishDate}
              onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
            />
          </div>
        </div>

        {/* Attachment */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Attachment / PDF</label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
            <IconPDF size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400 mt-0.5">PDF, DOC up to 10MB</p>
          </div>
        </div>

        {/* Notification */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setForm({ ...form, notify: !form.notify })}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              form.notify ? 'bg-blue-700 border-blue-700' : 'border-slate-300'
            }`}
          >
            {form.notify && <IconCheck size={10} className="text-white" />}
          </div>
          <span className="text-sm text-slate-700">Send push notification to students when published</span>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            Save Draft
          </button>
          <button
            onClick={() => form.title && setSubmitted(true)}
            className="flex-1 px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  )
}

function MyNoticesScreen() {
  const myNotices = allNotices.filter((n) => n.department === 'BCA' || n.department === 'Administration')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-900">My Notices</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{myNotices.length} total</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notification</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myNotices.map((notice) => (
                <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-800 text-sm leading-snug max-w-xs truncate">{notice.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{notice.department}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge label={notice.category} variant="gray" />
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{notice.date}</td>
                  <td className="px-4 py-3.5">
                    <Badge label={notice.status} variant={statusVariant(notice.status)} />
                  </td>
                  <td className="px-4 py-3.5">
                    {notice.notificationSent ? (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <IconCheck size={13} />
                        Sent
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <IconEye size={15} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <IconEdit size={15} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <IconTrash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PendingScreen() {
  const pending = allNotices.filter((n) => n.status === 'Pending' && n.department === 'BCA')

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-6">Pending Notices</h1>
      <div className="space-y-4">
        {pending.map((notice) => (
          <div key={notice.id} className="bg-white border border-yellow-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge label="Pending Approval" variant="warning" />
                  <Badge label={notice.category} variant="gray" />
                </div>
                <h3 className="font-semibold text-slate-900">{notice.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Submitted on {notice.date} · Awaiting Super Admin review</p>
              </div>
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            No pending notices.
          </div>
        )}
      </div>
    </div>
  )
}

export default function DeptAdminApp({ onLogout }: { onLogout: () => void }) {
  const [screen, setScreen] = useState<Screen>('dashboard')

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar screen={screen} setScreen={setScreen} onLogout={onLogout} />
      <main className="flex-1 ml-56 p-6">
        {screen === 'dashboard' && <DashboardScreen setScreen={setScreen} />}
        {screen === 'add' && <AddNoticeScreen setScreen={setScreen} />}
        {screen === 'my-notices' && <MyNoticesScreen />}
        {screen === 'pending' && <PendingScreen />}
      </main>
    </div>
  )
}
