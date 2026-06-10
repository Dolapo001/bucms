'use client';

import React from 'react';
import SermonsPage from '@/app/(public)/sermons/page';

export default function MemberSermons() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-surface-200/60 dark:border-surface-800/60 pb-5">
        <h2 className="text-xl font-extrabold text-surface-900 dark:text-white">Pastoral Audio Outlines</h2>
        <p className="text-xs text-surface-500 mt-1">Listen to standard Bowen weekly outlines, Sunday messages, and special student dedications.</p>
      </div>
      <SermonsPage />
    </div>
  );
}
