import { Link, useLocation } from 'react-router-dom'
import { IconDashboard, IconNotice, IconPlus, IconAlertCircle, IconLogOut, IconCpu } from './icons'
import { useAuth } from '../context/AuthContext'

export default function AdminSidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const items = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <IconDashboard size={18} /> },
    { path: '/admin/create', label: 'Create Notice', icon: <IconPlus size={18} /> },
    { path: '/admin/notices', label: 'My Department Notices', icon: <IconNotice size={18} /> },
    { path: '/admin/analytics', label: 'Engagement Analytics', icon: <IconCpu size={18} /> },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-20 shadow-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img src="/dsvv.webp" alt="DSVV Logo" className="w-9 h-9 object-contain mr-3" />
          <div>
            <div className="font-extrabold text-white text-sm">DSVV Updates</div>
            <div className="text-purple-300 text-[10px] font-semibold">Department Admin Panel</div>
          </div>
        </div>
      </div>

      {/* User Badge */}
      <div className="p-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed In As</p>
          <p className="text-xs font-bold text-white mt-0.5">{user?.name || 'Dept Admin'}</p>
          <p className="text-[11px] text-purple-300 font-medium mt-0.5">
            {user?.departmentId?.name || 'Department Administrator'}
          </p>
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
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <IconLogOut size={16} />
          Logout Account
        </button>
      </div>
    </aside>
  )
}
