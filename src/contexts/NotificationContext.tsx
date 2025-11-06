import { createContext, useContext, useState, ReactNode } from "react";

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'status_change' | 'interview' | 'candidate' | 'general';
  candidateName?: string;
  oldStatus?: string;
  newStatus?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'unread'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "ผู้สมัครใหม่",
      description: "มีผู้สมัครใหม่ 5 คนยังไม่ได้ตรวจสอบ",
      time: "5 นาทีที่แล้ว",
      unread: true,
      type: 'candidate',
    },
    {
      id: 2,
      title: "การสัมภาษณ์ใกล้เริ่ม",
      description: "สัมภาษณ์รอบบ่ายจะเริ่มในอีก 30 นาที",
      time: "30 นาทีที่แล้ว",
      unread: true,
      type: 'interview',
    },
  ]);

  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'unread'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      time: "เมื่อสักครู่",
      unread: true,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
