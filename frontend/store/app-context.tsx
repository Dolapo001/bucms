'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Notification } from '@/types';
import { useRouter } from 'next/navigation';
import { notificationService } from '@/services/notifications';

interface AppContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  notifications: Notification[];
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => void;
  markNotificationRead: (id: string | number) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  // Load auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('bucms_token');
      const storedUser = localStorage.getItem('bucms_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Error hydrating auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Synchronize notifications from backend when authenticated
  useEffect(() => {
    let active = true;
    if (isAuthenticated) {
      notificationService.getNotifications()
        .then(res => {
          if (active) {
            setNotifications(res.results);
          }
        })
        .catch(err => {
          console.error('Failed to retrieve backend notifications:', err);
        });
    } else {
      setNotifications([]);
    }
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('bucms_token', newToken);
    localStorage.setItem('bucms_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);

    // Role-based dashboard redirect
    if (newUser.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('bucms_token');
    localStorage.removeItem('bucms_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
    router.push('/login');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    localStorage.setItem('bucms_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const addNotification = (n: Omit<Notification, 'id' | 'read' | 'created_at'>) => {
    const newNotif: Notification = {
      ...n,
      id: `local-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = async (id: string | number) => {
    try {
      // If it is a real database UUID, sync with backend
      if (typeof id === 'string' && !id.startsWith('local-')) {
        await notificationService.markAsRead(id);
      }
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const clearNotifications = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        sidebarOpen,
        notifications,
        login,
        logout,
        updateUser,
        setSidebarOpen,
        addNotification,
        markNotificationRead,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
