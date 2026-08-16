import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'

// Auth Pages
import Login from './pages/Login'

// Student Pages
import StudentDashboard from './pages/StudentDashboard'
import StudentDeptFeed from './pages/StudentDeptFeed'
import StudentCentralFeed from './pages/StudentCentralFeed'
import StudentNotifications from './pages/StudentNotifications'
import StudentSearch from './pages/StudentSearch'
import StudentSaved from './pages/StudentSaved'
import StudentProfile from './pages/StudentProfile'

// Dept Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import AdminCreateNotice from './pages/AdminCreateNotice'
import AdminMyNotices from './pages/AdminMyNotices'
import AdminAnalytics from './pages/AdminAnalytics'

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import SuperAdminApprovals from './pages/SuperAdminApprovals'
import SuperAdminAllNotices from './pages/SuperAdminAllNotices'
import SuperAdminCollector from './pages/SuperAdminCollector'
import SuperAdminDepartments from './pages/SuperAdminDepartments'
import SuperAdminUsers from './pages/SuperAdminUsers'
import SuperAdminAnalytics from './pages/SuperAdminAnalytics'
import SuperAdminAudit from './pages/SuperAdminAudit'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Student Routes */}
            <Route element={<RoleRoute allowedRoles={['student']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/dept" element={<StudentDeptFeed />} />
              <Route path="/student/central" element={<StudentCentralFeed />} />
              <Route path="/student/notifications" element={<StudentNotifications />} />
              <Route path="/student/search" element={<StudentSearch />} />
              <Route path="/student/saved" element={<StudentSaved />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            </Route>

            {/* Dept Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['dept_admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/create" element={<AdminCreateNotice />} />
              <Route path="/admin/notices" element={<AdminMyNotices />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Super Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['super_admin']} />}>
              <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/approvals" element={<SuperAdminApprovals />} />
              <Route path="/superadmin/notices" element={<SuperAdminAllNotices />} />
              <Route path="/superadmin/collector" element={<SuperAdminCollector />} />
              <Route path="/superadmin/departments" element={<SuperAdminDepartments />} />
              <Route path="/superadmin/users" element={<SuperAdminUsers />} />
              <Route path="/superadmin/analytics" element={<SuperAdminAnalytics />} />
              <Route path="/superadmin/audit" element={<SuperAdminAudit />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
