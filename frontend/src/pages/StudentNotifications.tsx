import { useState } from 'react'
import StudentNavbar from '../components/StudentNavbar'
import AISummaryModal from '../components/AISummaryModal'
import { useNotifications } from '../context/NotificationContext'
import { IconBell, IconCheck, IconEye } from '../components/icons'
import * as noticeService from '../services/noticeService'

export default function StudentNotifications() {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications()
  const [selectedNotice, setSelectedNotice] = useState<any>(null)
  const [loadingNotice, setLoadingNotice] = useState(false)

  const handleNotificationClick = async (notif: any) => {
    if (!notif.read) {
      await markAsRead(notif.id)
    }
    if (notif.noticeId) {
      try {
        setLoadingNotice(true)
        const res = await noticeService.getNotice(notif.noticeId)
        if (res.success) {
          setSelectedNotice(res.notice)
        }
      } catch (e) {
        console.warn('Could not load notice detail:', e)
      } finally {
        setLoadingNotice(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <StudentNavbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <IconBell size={24} className="text-blue-700" />
              Notifications
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{unreadCount} unread notifications</p>
          </div>

          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
          >
            <IconCheck size={14} />
            Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  !n.read
                    ? 'bg-blue-50/60 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-200 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                        !n.read ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'
                      }`}
                    />
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] font-semibold text-slate-400 mt-2 block">
                        {new Date(n.time).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 shrink-0">
                    <IconEye size={13} /> View Notice
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium">
              No notifications.
            </div>
          )}
        </div>
      </main>

      {selectedNotice && (
        <AISummaryModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      )}
    </div>
  )
}
