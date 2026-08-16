import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import * as departmentService from '../services/departmentService'
import { IconZap, IconRefresh, IconCheck, IconX } from '../components/icons'

export default function SuperAdminCollector() {
  const [connectors, setConnectors] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncingId, setSyncingId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await departmentService.getSourceConnectors()
      if (res.success) {
        setConnectors(res.connectors)
        setItems(res.autoDetectedItems)
      }
    } catch (e) {
      console.warn('Failed to load collector data:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSync = async (id: string) => {
    setSyncingId(id)
    try {
      const res = await departmentService.checkSourceConnector(id)
      if (res.success) {
        alert(`Sync complete! Found ${res.newItems?.length || 0} new notices.`)
        loadData()
      }
    } catch (e) {
      alert('Sync failed.')
    } finally {
      setSyncingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <SuperAdminSidebar />

      <main className="flex-1 ml-64 p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <IconZap size={24} className="text-purple-400" />
            Automatic Notice Collector
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated ingestion of circulars from official DSVV web properties
          </p>
        </div>

        {/* Connectors */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-3">
            Active Data Sources (Websites / Feeds)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {connectors.map(c => (
              <div key={c._id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    {c.name}
                    {c.status === 'connected' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">{c.url}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Last sync: {c.lastCheckedAt ? new Date(c.lastCheckedAt).toLocaleString() : 'Never'}
                  </p>
                </div>
                <button
                  onClick={() => handleSync(c._id)}
                  disabled={syncingId === c._id}
                  className="p-2.5 bg-purple-900/40 hover:bg-purple-900/80 text-purple-300 rounded-lg transition-colors border border-purple-800/50"
                >
                  <IconRefresh size={16} className={syncingId === c._id ? 'animate-spin' : ''} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Detected Items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-3">
            Auto-Detected Items & AI Analysis Queue
          </h3>
          
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item._id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider mb-2 inline-block">
                        {item.status}
                      </span>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">{item.excerpt}</p>
                    </div>
                    {item.status === 'new' && (
                      <button className="text-[10px] font-bold px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded shadow-md transition-colors">
                        Convert to Notice
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-8">No auto-detected items.</p>
          )}
        </div>
      </main>
    </div>
  )
}
