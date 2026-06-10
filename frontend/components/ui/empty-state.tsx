'use client';

import React from 'react';
import Button from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-2xl bg-surface-50/30 dark:bg-surface-900/10">
      {/* Icon frame */}
      <div className="p-4 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-400 dark:text-surface-500 mb-5">
        {icon || (
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25m-2.25-2.25l-2.25 2.25m2.25-2.25l2.25-2.25M3.75 7.5h16.5M9 3.75h6m-6 3h6" />
          </svg>
        )}
      </div>

      <h3 className="text-base font-bold text-surface-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
