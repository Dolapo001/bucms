'use client';

import React from 'react';
import AnnouncementsPage from '@/app/(public)/announcements/page';

export default function MemberAnnouncements() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-surface-200/60 dark:border-surface-800/60 pb-5">
        <h2 className="text-xl font-extrabold text-surface-900 dark:text-white">Notice Board Notifications</h2>
        <p className="text-xs text-surface-500 mt-1">Review urgent academic guidelines, chapel vigil schedules, and general announcements.</p>
      </div>
      <AnnouncementsPage />
    </div>
  );
}
