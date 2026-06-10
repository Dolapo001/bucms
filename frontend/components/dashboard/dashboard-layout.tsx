'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/store/app-context';
import { useTheme } from '@/store/theme-context';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole?: 'MEMBER' | 'ADMIN';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  allowedRole,
}) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    sidebarOpen,
    setSidebarOpen,
    notifications,
    markNotificationRead,
    clearNotifications,
    logout,
  } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Route security: Auto redirect if not logged in or role mismatch
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/login');
      } else if (allowedRole && user.role !== allowedRole) {
        // Mismatch redirect
        router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRole, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-gold-500 border-b-primary-800 border-r-transparent border-l-transparent border-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-surface-400">Loading Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Sidebar items based on Role
  const memberLinks = [
    { label: 'Welcome Portal', href: '/dashboard', icon: '🏠' },
    { label: 'Sermons Archive', href: '/dashboard/sermons', icon: '📖' },
    { label: 'Events Calendar', href: '/dashboard/events', icon: '📅' },
    { label: 'Announcements', href: '/dashboard/announcements', icon: '📢' },
    { label: 'Profile Settings', href: '/dashboard/profile', icon: '👤' },
  ];

  const adminLinks = [
    { label: 'CMS Dashboard', href: '/admin', icon: '📊' },
    { label: 'Sermons CMS', href: '/admin/sermons', icon: '📖' },
    { label: 'Events CMS', href: '/admin/events', icon: '📅' },
    { label: 'Announcements CMS', href: '/admin/announcements', icon: '📢' },
    { label: 'Users Directory', href: '/admin/users', icon: '👥' },
    { label: 'Profile Settings', href: '/admin/profile', icon: '👤' },
  ];

  const sidebarLinks = user.role === 'ADMIN' ? adminLinks : memberLinks;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* 1. Sidebar Panel (Desktop Layout) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-surface-200/60 dark:border-surface-800/60 bg-white dark:bg-surface-900 z-30">
        {/* Brand Banner */}
        <div className="h-20 flex items-center px-6 border-b border-surface-100 dark:border-surface-800/40">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-800 dark:bg-gold-500 flex items-center justify-center text-white dark:text-primary-950 font-bold">
              BU
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs uppercase text-surface-800 dark:text-white leading-none">Bowen Portal</span>
              <span className="font-display italic text-[10px] text-gold-500 font-semibold leading-none mt-0.5">
                {user.role === 'ADMIN' ? 'CMS Console' : 'Member Desk'}
              </span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all
                  ${isActive
                    ? 'bg-primary-800 text-white dark:bg-gold-500 dark:text-primary-950 shadow-md font-bold'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50'
                  }
                `}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-surface-100 dark:border-surface-800/40 flex flex-col gap-2.5">
          <div className="flex items-center gap-3 px-3 py-2 bg-surface-50 dark:bg-surface-950/40 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-950/30 border border-gold-200/20 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold text-sm uppercase">
              {user.first_name?.[0] || user.username?.[0]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-surface-900 dark:text-white truncate">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-[10px] text-surface-400 font-semibold tracking-wider uppercase truncate">
                {user.role}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/10 hover:bg-red-500/5 text-red-500 font-semibold text-xs transition-colors uppercase tracking-wider"
          >
            ❌ Logout
          </button>
        </div>
      </aside>

      {/* 2. Main Portal Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar header */}
        <header className="h-20 bg-white dark:bg-surface-900 border-b border-surface-200/60 dark:border-surface-800/60 flex items-center justify-between px-4 sm:px-6 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger burger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              🍔
            </button>
            <h1 className="text-base sm:text-lg font-bold text-surface-900 dark:text-white font-sans truncate">
              {user.role === 'ADMIN' ? 'Institutional CMS Portal' : 'Member Chapel Desk'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-surface-50 hover:bg-surface-100 dark:bg-surface-950 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 transition-colors border border-surface-100 dark:border-surface-800"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Notification triggers */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-xl bg-surface-50 hover:bg-surface-100 dark:bg-surface-950 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 relative transition-colors border border-surface-100 dark:border-surface-800"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border border-white dark:border-surface-900 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Inner Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 3. Mobile Navigation Menu Drawer Slide */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-surface-950/30 backdrop-blur-xs"
            />
            {/* Sidebar drawer body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative w-64 max-w-xs bg-white dark:bg-surface-900 h-full shadow-premium flex flex-col z-10"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-surface-100 dark:border-surface-800/40">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-800 dark:bg-gold-500 flex items-center justify-center text-white dark:text-primary-950 font-bold">
                    BU
                  </div>
                  <span className="font-bold text-xs uppercase dark:text-white">Bowen Portal</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-lg text-surface-400 hover:text-surface-600"
                >
                  ✕
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all
                      ${pathname === link.href
                        ? 'bg-primary-800 text-white dark:bg-gold-500 dark:text-primary-950 shadow-md font-bold'
                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50'
                      }
                    `}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-surface-100 dark:border-surface-800/40 flex flex-col gap-2">
                <button
                  onClick={logout}
                  className="w-full py-3 rounded-xl border border-red-500/10 hover:bg-red-500/5 text-red-500 font-semibold text-xs transition-colors uppercase tracking-wider"
                >
                  ❌ Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Glassmorphism Notification Drawer Overlay */}
      <AnimatePresence>
        {notifOpen && (
          <div className="fixed inset-0 z-40 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotifOpen(false)}
              className="fixed inset-0 bg-surface-950/20 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative w-full max-w-sm bg-white/95 dark:bg-surface-900/95 backdrop-blur-md h-full shadow-premium flex flex-col z-10 border-l border-surface-200/50 dark:border-surface-800/50"
            >
              <div className="px-6 py-5 border-b border-surface-100 dark:border-surface-800/40 flex items-center justify-between">
                <h3 className="text-base font-bold text-surface-900 dark:text-white">🔔 User Notifications Inbox</h3>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="p-1 text-surface-400 hover:text-surface-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
                    <span className="text-3xl">📭</span>
                    <p className="text-xs font-bold text-surface-400 uppercase">Inbox is Empty</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5
                        ${notif.read
                          ? 'bg-surface-50/50 text-surface-500 border-surface-200/30 dark:bg-surface-950/20 dark:border-surface-800/20'
                          : 'bg-gold-50/10 border-gold-500/20 text-surface-900 dark:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold leading-none">{notif.title}</span>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />}
                      </div>
                      <p className="text-xs opacity-90 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-surface-400 self-end mt-1">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 border-t border-surface-100 dark:border-surface-800/40">
                  <button
                    onClick={clearNotifications}
                    className="w-full py-2.5 rounded-xl border border-surface-200 dark:border-surface-800 hover:bg-surface-100 text-surface-600 dark:text-surface-300 font-semibold text-xs transition-colors uppercase tracking-wider"
                  >
                    Clear All Notifications
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
