import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import * as departmentService from '../services/departmentService'
import { IconSettings } from '../components/icons'

export default function SuperAdminAudit() {
  const [logs, setLogs] = useState<any[]>([])
  
  useEffect(() => {
    departmentService.getAuditLogs().then(res => {
      if (res.success) setLogs(res.logs)
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <SuperAdminSidebar />
      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <IconSettings size={24} className="text-slate-400" />
            Security Audit Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">Immutable trail of administrative actions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                {logs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-850">
                    <td className="p-4">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-4 font-bold text-white">{log.action}</td>
                    <td className="p-4">{log.actorEmail}</td>
                    <td className="p-4">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">{log.actorRole}</span>
                    </td>
                    <td className="p-4">{log.entity}</td>
                    <td className="p-4 font-mono text-[10px]">{log.ipAddress || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && <div className="p-12 text-center text-slate-500 text-xs">No audit logs found.</div>}
          </div>
        </div>
      </main>
    </div>
  )
}
