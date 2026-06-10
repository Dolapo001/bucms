'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRole="ADMIN">
      {children}
    </DashboardLayout>
  );
}
