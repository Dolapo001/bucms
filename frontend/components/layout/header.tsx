'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/store/app-context';
import { useTheme } from '@/store/theme-context';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Events & Programs', href: '/events' },
    { label: 'Announcements', href: '/announcements' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="glass-nav border-b border-surface-200/50 dark:border-surface-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              {/* Logo icon */}
              <div className="w-10 h-10 rounded-xl bg-primary-800 dark:bg-gold-500 flex items-center justify-center text-white dark:text-primary-950 font-bold shadow-md">
                BU
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none tracking-wide text-primary-900 dark:text-white uppercase font-sans">
                  Bowen University
                </span>
                <span className="font-display italic text-xs text-gold-500 font-bold">
                  Chapel Management
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-all relative py-1
                    ${isActive
                      ? 'text-gold-500 font-bold'
                      : 'text-surface-600 hover:text-primary-800 dark:text-surface-300 dark:hover:text-gold-400'
                    }
                  `}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300 transition-colors"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-800 text-white hover:bg-primary-900 shadow-md transition-all uppercase tracking-wide"
                >
                  Portal
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-bold text-surface-500 hover:text-red-500 transition-colors uppercase tracking-wide"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gold-500 text-primary-950 hover:bg-gold-600 shadow-md transition-all uppercase tracking-wide"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold py-2.5 px-3 rounded-xl transition-all
                    ${pathname === link.href
                      ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 font-bold'
                      : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-surface-100 dark:bg-surface-800 my-1" />
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-3 rounded-xl text-sm font-bold bg-primary-800 text-white text-center shadow-md transition-all"
                  >
                    Enter Portal
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-6 py-3 rounded-xl text-sm font-semibold border border-red-500/10 text-red-500 hover:bg-red-500/5 transition-all text-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-gold-500 text-primary-950 text-center shadow-md transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
