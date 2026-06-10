'use client';

import React from 'react';
import EventsPage from '@/app/(public)/events/page';

export default function MemberEvents() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-surface-200/60 dark:border-surface-800/60 pb-5">
        <h2 className="text-xl font-extrabold text-surface-900 dark:text-white">Events & Liturgies</h2>
        <p className="text-xs text-surface-500 mt-1">Keep track of chapel convocations, mid-week worship hours, and campus praise fellowships.</p>
      </div>
      <EventsPage />
    </div>
  );
}
