import { useState } from 'react'
import {
  IconDashboard,
  IconNotice,
  IconBell,
  IconUser,
  IconUsers,
  IconBuilding,
  IconAlertCircle,
  IconZap,
  IconCpu,
  IconSettings,
  IconCheck,
  IconX,
  IconEdit,
  IconEye,
  IconLogOut,
  IconRefresh,
  IconClock,
  IconShield,
  IconDatabase,
  IconArrowRight,
  IconGlobe,
  IconTag,
  IconFilter,
} from '../components/icons'
import { notices, departments, autoDetectedItems, superStats, type NoticeStatus } from '../data'

type Screen = 'dashboard' | 'all-notices' | 'pending' | 'collector' | 'classification' | 'departments' | 'admins' | 'workflow' | 'notifications'

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
    Draft: 'gray', Pending: 'warning', Approved: 'blue', Published: 'success', Rejected: 'danger',
  }
  return map[s] ?? 'gray'
}

function Sidebar({ screen, setScreen, onLogout }: { screen: Screen; setScreen: (s: Screen) => void; onLogout: () => void }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard size={17} /> },
    { id: 'all-notices', label: 'All Notices', icon: <IconNotice size={17} /> },
    { id: 'pending', label: 'Pending Approvals', icon: <IconAlertCircle size={17} />, badge: superStats.pendingApproval },
    { id: 'collector', label: 'Auto Collector', icon: <IconZap size={17} /> },
    { id: 'departments', label: 'Departments', icon: <IconBuilding size={17} /> },
    { id: 'admins', label: 'Dept Admins', icon: <IconUsers size={17} /> },
    { id: 'workflow', label: 'System Workflow', icon: <IconCpu size={17} /> },
    { id: 'notifications', label: 'Notifications', icon: <IconBell size={17} /> },
    { id: 'dashboard', label: 'System Settings', icon: <IconSettings size={17} /> },
  ]

  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-20">
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">D</span>
          </div>
          <div>
            <div className="font-semibold text-white text-sm">DSVV Updates</div>
            <div className="text-slate-400 text-[10px]">Super Admin Panel</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg px-3 py-2">
          <p className="text-[10px] text-blue-300 font-medium">SIGNED IN AS</p>
          <p className="text-xs font-semibold text-blue-100 mt-0.5 flex items-center gap-1.5">
            <IconShield size={12} />
            Super Administrator
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setScreen(item.id as Screen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
              screen === item.id && (item.id !== 'dashboard' || i === 0)
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500 text-yellow-900">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 pb-5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <IconLogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}

function StatCard({ label, value, sub, icon, color, bg }: {
  label: string; value: number | string; sub?: string; icon: React.ReactNode; color: string; bg: string
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
        <div className={color}>{icon}</div>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function DashboardScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Super Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Complete system overview and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Notices" value={superStats.totalNotices} icon={<IconNotice size={18} />} color="text-blue-600" bg="bg-blue-50" sub="All departments" />
        <StatCard label="Pending Approval" value={superStats.pendingApproval} icon={<IconAlertCircle size={18} />} color="text-yellow-600" bg="bg-yellow-50" sub="Needs review" />
        <StatCard label="Published" value={superStats.published} icon={<IconCheck size={18} />} color="text-green-600" bg="bg-green-50" sub="Live on student feed" />
        <StatCard label="Auto Detected" value={superStats.autoDetected} icon={<IconZap size={18} />} color="text-purple-600" bg="bg-purple-50" sub="By automatic collector" />
        <StatCard label="Departments" value={superStats.departments} icon={<IconBuilding size={18} />} color="text-slate-600" bg="bg-slate-100" />
        <StatCard label="Notifications Sent" value={superStats.notificationsSent.toLocaleString()} icon={<IconBell size={18} />} color="text-sky-600" bg="bg-sky-50" sub="This month" />
      </div>

      {/* Collector status */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <IconZap size={16} className="text-purple-600" />
            Automatic Collector Status
          </h2>
          <button onClick={() => setScreen('collector')} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Manage →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <div>
              <p className="text-xs font-semibold text-green-800">DSVV Official Website</p>
              <p className="text-[11px] text-green-600">Connected · Last checked 10 min ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <IconClock size={14} className="text-slate-400" />
            <div>
              <p className="text-xs font-semibold text-slate-700">Next Check</p>
              <p className="text-[11px] text-slate-500">In 5 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <IconCpu size={14} className="text-purple-500" />
            <div>
              <p className="text-xs font-semibold text-purple-800">New Detections Today</p>
              <p className="text-[11px] text-purple-600">3 items pending review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending quick preview */}
      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <IconAlertCircle size={16} className="text-yellow-500" />
            Pending Approvals
          </h2>
          <button onClick={() => setScreen('pending')} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            View all ({superStats.pendingApproval}) →
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {notices.filter((n) => n.status === 'Pending').slice(0, 3).map((notice) => (
            <div key={notice.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge label={notice.source === 'Automatic' ? 'Auto-detected' : 'Dept Admin'} variant={notice.source === 'Automatic' ? 'blue' : 'purple'} />
                  <Badge label={notice.category} variant="gray" />
                </div>
                <p className="text-sm font-medium text-slate-800">{notice.title}</p>
                <p className="text-xs text-slate-400">{notice.department} · {notice.date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setScreen('pending')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PendingScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [actionTaken, setActionTaken] = useState<Record<string, 'approved' | 'rejected'>>({})
  const pending = notices.filter((n) => n.status === 'Pending')

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-slate-900">Pending Approvals</h1>

      {pending.map((notice) => {
        const done = actionTaken[notice.id]
        return (
          <div key={notice.id} className={`bg-white border rounded-xl overflow-hidden transition-all ${done === 'approved' ? 'border-green-300' : done === 'rejected' ? 'border-red-300' : 'border-slate-200'}`}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge label={notice.source === 'Automatic' ? 'Auto-detected' : 'Department Admin'} variant={notice.source === 'Automatic' ? 'blue' : 'purple'} />
                    <Badge label={notice.category} variant="gray" />
                    <Badge label={notice.priority + ' Priority'} variant={notice.priority === 'High' ? 'danger' : 'warning'} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{notice.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{notice.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Department', value: notice.department },
                      { label: 'Category', value: notice.category },
                      { label: 'Type', value: 'Timetable' },
                      { label: 'Detected / Submitted', value: notice.date },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 rounded-lg p-2.5">
                        <p className="text-[10px] text-slate-400">{item.label}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {notice.source === 'Automatic' && notice.confidence && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-600">Classification Confidence:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${notice.confidence >= 90 ? 'bg-green-500' : notice.confidence >= 75 ? 'bg-yellow-500' : 'bg-red-400'}`}
                            style={{ width: `${notice.confidence}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${notice.confidence >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {notice.confidence}%
                        </span>
                      </div>
                      <button
                        onClick={() => setScreen('classification')}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Classification →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {done ? (
              <div className={`px-5 py-3 flex items-center gap-2 ${done === 'approved' ? 'bg-green-50 border-t border-green-200' : 'bg-red-50 border-t border-red-200'}`}>
                {done === 'approved' ? (
                  <><IconCheck size={14} className="text-green-600" /><span className="text-xs font-medium text-green-700">Approved & Published to student feed</span></>
                ) : (
                  <><IconX size={14} className="text-red-600" /><span className="text-xs font-medium text-red-700">Rejected — Department Admin has been notified</span></>
                )}
              </div>
            ) : (
              <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <button
                  onClick={() => setActionTaken((p) => ({ ...p, [notice.id]: 'approved' }))}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <IconCheck size={14} />
                  Approve & Publish
                </button>
                <button
                  onClick={() => setScreen('classification')}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                >
                  <IconEdit size={14} />
                  Edit Classification
                </button>
                <button
                  onClick={() => setActionTaken((p) => ({ ...p, [notice.id]: 'rejected' }))}
                  className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <IconX size={14} />
                  Reject
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CollectorScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [actionTaken, setActionTaken] = useState<Record<string, 'approved' | 'rejected'>>({})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <IconZap size={20} className="text-purple-600" />
            Automatic Notice Collector
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time detection from authorized DSVV sources</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
          <IconRefresh size={14} />
          Force Check Now
        </button>
      </div>

      {/* Source status */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="font-semibold text-slate-900 text-sm mb-4">Source Status</h2>
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <IconGlobe size={18} className="text-green-700" />
            </div>
            <div>
              <p className="font-semibold text-green-900 text-sm">DSVV Official Website</p>
              <p className="text-xs text-green-600">dsvv.ac.in · Authorized Source</p>
            </div>
          </div>
          <div className="text-right">
            <Badge label="Connected" variant="success" />
            <p className="text-xs text-slate-500 mt-1.5">Last Checked: <span className="font-medium">10 minutes ago</span></p>
            <p className="text-xs text-slate-500">Next Check: <span className="font-medium text-blue-600">In 5 minutes</span></p>
          </div>
        </div>
      </div>

      {/* Detected items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Newly Detected Information
          </h2>
          <span className="text-xs text-slate-400">{autoDetectedItems.length} items</span>
        </div>

        <div className="space-y-4">
          {autoDetectedItems.map((item) => {
            const done = actionTaken[item.id]
            return (
              <div key={item.id} className={`bg-white border rounded-xl overflow-hidden ${done ? 'opacity-60' : 'border-slate-200'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge label={item.status === 'New' ? 'New Detection' : item.status} variant={item.status === 'New' ? 'blue' : 'warning'} />
                        <Badge label={item.category} variant="gray" />
                        <Badge label={item.priority + ' Priority'} variant={item.priority === 'High' ? 'danger' : 'warning'} />
                      </div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400">Detected {item.detected}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 italic mb-3 pl-3 border-l-2 border-slate-200">"{item.excerpt}"</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Source', value: item.source },
                      { label: 'Dept (suggested)', value: item.department },
                      { label: 'Category', value: item.category },
                      { label: 'Confidence', value: `${item.confidence}%` },
                    ].map((d) => (
                      <div key={d.label} className="bg-slate-50 rounded-lg p-2">
                        <p className="text-[10px] text-slate-400">{d.label}</p>
                        <p className={`text-xs font-semibold mt-0.5 ${d.label === 'Confidence' && item.confidence >= 90 ? 'text-green-600' : d.label === 'Confidence' ? 'text-yellow-600' : 'text-slate-700'}`}>
                          {d.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Confidence:</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.confidence >= 90 ? 'bg-green-500' : 'bg-yellow-400'}`}
                          style={{ width: `${item.confidence}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${item.confidence >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>{item.confidence}%</span>
                    </div>
                  </div>
                </div>

                {!done && (
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <button
                      onClick={() => setScreen('classification')}
                      className="px-3 py-1.5 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors"
                    >
                      Review Classification
                    </button>
                    <button
                      onClick={() => setActionTaken((p) => ({ ...p, [item.id]: 'approved' }))}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setActionTaken((p) => ({ ...p, [item.id]: 'rejected' }))}
                      className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {done && (
                  <div className={`px-5 py-2 border-t flex items-center gap-2 text-xs font-medium ${done === 'approved' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                    {done === 'approved' ? <><IconCheck size={13} /> Approved & sent to verification queue</> : <><IconX size={13} /> Rejected</>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ClassificationScreen() {
  const [confirmed, setConfirmed] = useState(false)
  const item = autoDetectedItems[0]
  const keywords = ['BCA', 'Semester', 'Examination', 'Schedule', 'Revised', 'Timetable', '2nd']

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <IconCheck size={28} className="text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Classification Confirmed</h2>
        <p className="text-sm text-slate-500">The notice has been classified and moved to the approval queue.</p>
        <button onClick={() => setConfirmed(false)} className="mt-5 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800">
          Classify Another
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <IconCpu size={20} className="text-purple-600" />
          Automatic Classification
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">AI-powered notice classification result</p>
      </div>

      {/* Input */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Input Notice</p>
        <p className="text-base font-semibold text-slate-900 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200 italic">
          "{item.title}"
        </p>
        <p className="text-xs text-slate-400 mt-2">Source: {item.source} · Detected {item.detected}</p>
      </div>

      {/* Keywords */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Extracted Keywords</p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span key={kw} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Classification result */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">System Classification</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Department', value: 'BCA', color: 'bg-blue-50 border-blue-200 text-blue-800' },
            { label: 'Category', value: 'Examination', color: 'bg-red-50 border-red-200 text-red-800' },
            { label: 'Type', value: 'Timetable', color: 'bg-purple-50 border-purple-200 text-purple-800' },
            { label: 'Priority', value: 'High', color: 'bg-orange-50 border-orange-200 text-orange-800' },
          ].map((c) => (
            <div key={c.label} className={`border rounded-xl p-3 ${c.color}`}>
              <p className="text-[10px] font-medium opacity-70 mb-0.5">{c.label}</p>
              <p className="font-bold text-sm">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Confidence */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Classification Confidence</span>
            <span className="text-lg font-bold text-green-600">{item.confidence}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${item.confidence}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">High confidence — classification is likely accurate</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setConfirmed(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <IconCheck size={15} />
          Confirm Classification
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
          <IconEdit size={15} />
          Edit Classification
        </button>
      </div>
    </div>
  )
}

function AllNoticesScreen() {
  const [filterDept, setFilterDept] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')

  const filtered = notices.filter((n) => {
    return (
      (!filterDept || n.department === filterDept) &&
      (!filterStatus || n.status === filterStatus) &&
      (!filterSource || n.source === filterSource)
    )
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">All Notices</h1>
        <span className="text-sm text-slate-500">{filtered.length} of {notices.length} notices</span>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <IconFilter size={14} className="text-slate-400" />
          <select
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 bg-white"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
          <select
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option>Published</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Draft</option>
          </select>
          <select
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 bg-white"
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
          >
            <option value="">All Sources</option>
            <option>Automatic</option>
            <option>Department Admin</option>
          </select>
          {(filterDept || filterStatus || filterSource) && (
            <button onClick={() => { setFilterDept(''); setFilterStatus(''); setFilterSource('') }} className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1">
              <IconX size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Notice', 'Department', 'Category', 'Source', 'Date', 'Status', 'Notification', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((notice) => (
                <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="font-medium text-slate-800 text-xs leading-snug truncate">{notice.title}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">{notice.department}</td>
                  <td className="px-4 py-3.5">
                    <Badge label={notice.category} variant="gray" />
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge label={notice.source} variant={notice.source === 'Automatic' ? 'blue' : 'purple'} />
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{notice.date}</td>
                  <td className="px-4 py-3.5">
                    <Badge label={notice.status} variant={statusVariant(notice.status)} />
                  </td>
                  <td className="px-4 py-3.5 text-xs">
                    {notice.notificationSent ? (
                      <span className="text-green-600 font-medium flex items-center gap-1"><IconCheck size={12} />Sent</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <IconEye size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <IconEdit size={14} />
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

function WorkflowScreen() {
  const autoSteps = [
    { icon: <IconGlobe size={18} />, label: 'DSVV Official Sources', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { icon: <IconZap size={18} />, label: 'Automatic Collector', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { icon: <IconAlertCircle size={18} />, label: 'New Information Detected', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { icon: <IconTag size={18} />, label: 'Content Extraction', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { icon: <IconCpu size={18} />, label: 'Automatic Classification', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { icon: <IconTag size={18} />, label: 'Dept + Category + Priority', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { icon: <IconShield size={18} />, label: 'Super Admin Verification', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { icon: <IconCheck size={18} />, label: 'Approve / Edit / Reject', color: 'bg-green-100 text-green-700 border-green-200' },
    { icon: <IconDatabase size={18} />, label: 'Database', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { icon: <IconNotice size={18} />, label: 'Unified Student Feed', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { icon: <IconFilter size={18} />, label: 'Search + Filter', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { icon: <IconBell size={18} />, label: 'Push Notification', color: 'bg-red-100 text-red-700 border-red-200' },
  ]

  const deptSteps = [
    { icon: <IconUser size={18} />, label: 'Department Admin', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { icon: <IconNotice size={18} />, label: 'Add Notice', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { icon: <IconTag size={18} />, label: 'Select Category', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { icon: <IconArrowRight size={18} />, label: 'Submit', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { icon: <IconShield size={18} />, label: 'Super Admin Approval', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { icon: <IconDatabase size={18} />, label: 'Database', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { icon: <IconNotice size={18} />, label: 'Student Feed', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { icon: <IconBell size={18} />, label: 'Push Notification', color: 'bg-red-100 text-red-700 border-red-200' },
  ]

  const FlowColumn = ({ steps, title, titleColor }: { steps: typeof autoSteps; title: string; titleColor: string }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className={`font-semibold text-sm mb-5 ${titleColor}`}>{title}</h3>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i}>
            <div className={`flex items-center gap-3 px-3 py-2.5 border rounded-xl ${step.color}`}>
              {step.icon}
              <span className="text-sm font-medium">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-0.5 h-4 bg-slate-200" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">System Workflow Architecture</h1>
        <p className="text-sm text-slate-500 mt-0.5">End-to-end notice aggregation and distribution pipeline</p>
      </div>

      {/* Key system description */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Aggregation', desc: 'Collects from multiple DSVV sources automatically', icon: <IconZap size={18} />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Classification', desc: 'AI-powered categorization with confidence scoring', icon: <IconCpu size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Verification', desc: 'Super Admin reviews before publishing to students', icon: <IconShield size={18} />, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} border border-slate-200 rounded-xl p-4 flex items-start gap-3`}>
            <div className={item.color}>{item.icon}</div>
            <div>
              <p className={`font-semibold text-sm ${item.color}`}>{item.label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlowColumn
          steps={autoSteps}
          title="Route 1: Automatic Detection Flow"
          titleColor="text-purple-700"
        />
        <FlowColumn
          steps={deptSteps}
          title="Route 2: Department Admin Submission Flow"
          titleColor="text-blue-700"
        />
      </div>
    </div>
  )
}

function DepartmentsScreen() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Departments</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors">
          + Add Department
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Department', 'Admin', 'Total Notices', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-700 text-xs font-bold">{dept.name[0]}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{dept.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600 text-xs">{dept.admin}</td>
                <td className="px-5 py-4 text-slate-700 font-medium">{dept.notices}</td>
                <td className="px-5 py-4">
                  <Badge label={dept.status} variant="success" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><IconEye size={14} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><IconEdit size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminsScreen() {
  const admins = [
    { name: 'Prof. Ramesh Sharma', dept: 'BCA', email: 'r.sharma@dsvv.ac.in', status: 'Active', perms: ['Create Notice', 'Manage Timetable', 'Manage Circulars', 'View Analytics'] },
    { name: 'Dr. Priya Patel', dept: 'B.Sc IT', email: 'p.patel@dsvv.ac.in', status: 'Active', perms: ['Create Notice', 'Manage Timetable', 'View Analytics'] },
    { name: 'Prof. Anil Verma', dept: 'MCA', email: 'a.verma@dsvv.ac.in', status: 'Active', perms: ['Create Notice', 'Manage Circulars', 'Manage Timetable', 'View Analytics'] },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Department Admins</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors">
          + Create Admin
        </button>
      </div>
      {admins.map((admin, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-700 font-bold text-sm">{admin.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{admin.name}</p>
                <p className="text-xs text-slate-500">{admin.dept} · {admin.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge label={admin.status} variant="success" />
              <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><IconEdit size={14} /></button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Permissions</p>
            <div className="flex flex-wrap gap-2">
              {admin.perms.map((p) => (
                <span key={p} className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs">
                  <IconCheck size={10} />
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="text-xs px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">Disable Admin</button>
            <button className="text-xs px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">Reset Access</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function NotificationsScreen() {
  const notifs = [
    { title: 'BCA Timetable Updated', target: 'BCA — 2nd Year', category: 'Timetable', priority: 'Medium', status: 'Sent', recipients: 128 },
    { title: 'Examination Timetable Published', target: 'BCA — All Years', category: 'Examination', priority: 'High', status: 'Sent', recipients: 342 },
    { title: 'MCA Admission Last Date Extended', target: 'All Students', category: 'Admission', priority: 'High', status: 'Sent', recipients: 890 },
    { title: 'University Holiday — Independence Day', target: 'All Students', category: 'Holiday', priority: 'Medium', status: 'Scheduled', recipients: 0 },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Notification Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors">
          + Send Notification
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Notification', 'Target', 'Category', 'Priority', 'Status', 'Recipients'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notifs.map((n, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3.5">
                  <p className="font-medium text-slate-800 text-xs">{n.title}</p>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{n.target}</td>
                <td className="px-4 py-3.5"><Badge label={n.category} variant="gray" /></td>
                <td className="px-4 py-3.5"><Badge label={n.priority} variant={n.priority === 'High' ? 'danger' : 'warning'} /></td>
                <td className="px-4 py-3.5">
                  <Badge label={n.status} variant={n.status === 'Sent' ? 'success' : 'warning'} />
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-700 text-xs">
                  {n.recipients > 0 ? n.recipients.toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SuperAdminApp({ onLogout }: { onLogout: () => void }) {
  const [screen, setScreen] = useState<Screen>('dashboard')

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar screen={screen} setScreen={setScreen} onLogout={onLogout} />
      <main className="flex-1 ml-60 p-6">
        {screen === 'dashboard' && <DashboardScreen setScreen={setScreen} />}
        {screen === 'pending' && <PendingScreen setScreen={setScreen} />}
        {screen === 'collector' && <CollectorScreen setScreen={setScreen} />}
        {screen === 'classification' && <ClassificationScreen />}
        {screen === 'all-notices' && <AllNoticesScreen />}
        {screen === 'workflow' && <WorkflowScreen />}
        {screen === 'departments' && <DepartmentsScreen />}
        {screen === 'admins' && <AdminsScreen />}
        {screen === 'notifications' && <NotificationsScreen />}
      </main>
    </div>
  )
}
