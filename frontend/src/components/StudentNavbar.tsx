import { Link, useLocation } from 'react-router-dom'
import { IconDashboard, IconNotice, IconBell, IconSearch, IconBookmark, IconUser, IconLogOut } from './icons'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'

export default function StudentNavbar() {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const location = useLocation()

  const navItems = [
    { path: '/student', label: 'Dashboard', icon: <IconDashboard size={16} /> },
    { path: '/student/feed', label: 'Department Feed', icon: <IconNotice size={16} />, primary: true },
    { path: '/student/central', label: 'Central Feed', icon: <IconNotice size={16} /> },
    { path: '/student/search', label: 'Search', icon: <IconSearch size={16} /> },
    { path: '/student/saved', label: 'Saved Notices', icon: <IconBookmark size={16} /> },
  ]

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-6">
            <Link to="/student" className="flex items-center gap-3 group">
              <img src="/dsvv.webp" alt="DSVV Logo" className="w-10 h-10 object-contain mr-3" />
              <div>
                <div className="font-extrabold text-slate-900 text-base leading-none">DSVV Updates</div>
                <div className="text-slate-500 text-[11px] font-medium leading-none mt-1">Unified Notice Aggregator</div>
              </div>
            </Link>

            {/* Main Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? item.primary
                          ? 'bg-blue-700 text-white shadow-sm'
                          : 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    {item.primary && (
                      <span className="ml-1 text-[9px] font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full uppercase">
                        Primary
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Link
              to="/student/notifications"
              className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Notifications"
            >
              <IconBell size={19} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              to="/student/profile"
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80"
            >
              <div className="w-8 h-8 bg-blue-100 border border-blue-200 text-blue-800 rounded-lg flex items-center justify-center font-bold text-xs">
                {user?.name?.substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'Student'}</div>
                <div className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                  {user?.departmentId?.code || 'Student'} • {user?.semesterId?.label || 'Active'}
                </div>
              </div>
            </Link>

            <button
              onClick={logout}
              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Logout"
            >
              <IconLogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
