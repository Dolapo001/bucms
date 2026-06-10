'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';

export default function MemberPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRole="MEMBER">
      {children}
    </DashboardLayout>
  );
}
