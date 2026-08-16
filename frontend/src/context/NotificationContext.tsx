import { createContext, useContext, useState, useEffect } from 'react'
import * as notifService from '../services/notificationService'
import { useAuth } from './AuthContext'

interface NotificationContextType {
  notifications: any[]
  unreadCount: number
  refreshNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshNotifications = async () => {
    if (user && user.role === 'student') {
      try {
        const res = await notifService.getNotifications()
        if (res.success) {
          setNotifications(res.notifications)
          setUnreadCount(res.unreadCount)
        }
      } catch (e) {
        console.warn('Failed to load notifications:', e)
      }
    }
  }

  useEffect(() => {
    refreshNotifications()
  }, [user])

  const markAsRead = async (id: string) => {
    await notifService.markAsRead(id)
    await refreshNotifications()
  }

  const markAllRead = async () => {
    await notifService.markAllAsRead()
    await refreshNotifications()
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, refreshNotifications, markAsRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
