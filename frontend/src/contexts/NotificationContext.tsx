import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Charger les notifications depuis localStorage
  useEffect(() => {
    if (user) {
      const storedNotifications = JSON.parse(localStorage.getItem('bidtounsi_notifications') || '[]');
      const userNotifications = storedNotifications.filter((n: Notification) => n.userId === user.id);
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!user) return;

    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // Ajouter à l'état local
    setNotifications(prev => [newNotification, ...prev]);

    // Sauvegarder dans localStorage
    const allNotifications = JSON.parse(localStorage.getItem('bidtounsi_notifications') || '[]');
    allNotifications.push(newNotification);
    localStorage.setItem('bidtounsi_notifications', JSON.stringify(allNotifications));
  };

  const markAsRead = (notificationId: string) => {
    // Mettre à jour l'état local
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );

    // Mettre à jour localStorage
    const allNotifications = JSON.parse(localStorage.getItem('bidtounsi_notifications') || '[]');
    const updatedNotifications = allNotifications.map((n: Notification) => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('bidtounsi_notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    if (!user) return;

    // Mettre à jour l'état local
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    // Mettre à jour localStorage
    const allNotifications = JSON.parse(localStorage.getItem('bidtounsi_notifications') || '[]');
    const updatedNotifications = allNotifications.map((n: Notification) => 
      n.userId === user.id ? { ...n, read: true } : n
    );
    localStorage.setItem('bidtounsi_notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId: string) => {
    // Mettre à jour l'état local
    setNotifications(prev => prev.filter(n => n.id !== notificationId));

    // Mettre à jour localStorage
    const allNotifications = JSON.parse(localStorage.getItem('bidtounsi_notifications') || '[]');
    const updatedNotifications = allNotifications.filter((n: Notification) => n.id !== notificationId);
    localStorage.setItem('bidtounsi_notifications', JSON.stringify(updatedNotifications));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}