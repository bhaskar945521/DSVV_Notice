import { Link, useLocation } from 'react-router-dom'
import { IconDashboard, IconNotice, IconAlertCircle, IconZap, IconBuilding, IconUsers, IconCpu, IconLogOut, IconSettings, IconBell } from './icons'
import { useAuth } from '../context/AuthContext'

export default function SuperAdminSidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const items = [
    { path: '/super-admin', label: 'Dashboard', icon: <IconDashboard size={18} /> },
    { path: '/super-admin/approvals', label: 'Pending Approvals', icon: <IconAlertCircle size={18} /> },
    { path: '/super-admin/notices', label: 'All Notices Feed', icon: <IconNotice size={18} /> },
    { path: '/super-admin/sources', label: 'Automatic Collector', icon: <IconZap size={18} /> },
    { path: '/super-admin/departments', label: 'Departments', icon: <IconBuilding size={18} /> },
    { path: '/super-admin/users', label: 'User Directory', icon: <IconUsers size={18} /> },
    { path: '/super-admin/analytics', label: 'System Analytics', icon: <IconCpu size={18} /> },
    { path: '/super-admin/audit', label: 'Audit Logs', icon: <IconSettings size={18} /> },
  ]

  return (
    <aside className="w-64 bg-slate-950 text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-20 shadow-2xl border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img src="/dsvv.webp" alt="DSVV Logo" className="w-9 h-9 object-contain mr-3" />
          <div>
            <div className="font-extrabold text-white text-sm leading-none">DSVV Updates</div>
            <div className="text-blue-400 text-[10px] font-semibold leading-none mt-1">Super Admin Panel</div>
          </div>
        </div>
      </div>

      {/* User Badge */}
      <div className="p-4">
        <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Super Administrator</p>
          <p className="text-xs font-bold text-white mt-0.5">{user?.name || 'Super Admin'}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition-colors"
        >
          <IconLogOut size={16} />
          Logout Account
        </button>
      </div>
    </aside>
  )
}
