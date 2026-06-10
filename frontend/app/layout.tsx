import '@/styles/globals.css';
import { AppProvider } from '@/store/app-context';
import { ThemeProvider } from '@/store/theme-context';
import React from 'react';

export const metadata = {
  title: 'Bowen University Chapel Management System (BUCMS)',
  description: 'A modern, production-grade spiritual management console and portal for Bowen University chapel administration, sermons, and event schedules.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ThemeProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
