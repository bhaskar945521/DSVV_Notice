import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import * as departmentService from '../services/departmentService'
import { IconBuilding } from '../components/icons'

export default function SuperAdminDepartments() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    departmentService.getDepartments().then(res => {
      if (res.success) setDepartments(res.departments)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <SuperAdminSidebar />
      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <IconBuilding size={24} className="text-blue-500" />
            University Departments
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage academic departments and organizational structure</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map(d => (
            <div key={d._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-white">{d.name}</h3>
                <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{d.code}</span>
              </div>
              <p className="text-xs text-slate-400">School: {d.schoolId?.name}</p>
              <p className="text-xs text-slate-400">HOD: {d.hodName || 'Not assigned'}</p>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-blue-400 font-bold">{d.noticesCount || 0} notices published</span>
                <button className="text-slate-400 hover:text-white transition-colors">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
