import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import API from '../services/api'
import { IconUsers } from '../components/icons'

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/users').then(res => {
      setUsers(res.data.users)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <SuperAdminSidebar />
      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <IconUsers size={24} className="text-green-500" />
            User Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage system administrators and student accounts</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-850 transition-colors">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          u.role === 'super_admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          u.role === 'dept_admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">{u.departmentId?.name || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${u.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
