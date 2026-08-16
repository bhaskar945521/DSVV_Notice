import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    if (user?.role === 'student') return <Navigate to="/student" replace />
    if (user?.role === 'dept_admin') return <Navigate to="/admin" replace />
    if (user?.role === 'super_admin') return <Navigate to="/super-admin" replace />
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
