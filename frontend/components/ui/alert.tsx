'use client';

import React from 'react';

interface AlertProps {
  title?: string;
  description: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  variant = 'info',
  className = '',
  onClose,
}) => {
  const baseStyles = 'p-4 rounded-xl border flex gap-3 text-sm animate-fadeIn relative';
  
  const variants = {
    info: 'bg-blue-50 text-blue-800 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-500/20',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-500/20',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-500/20',
    error: 'bg-red-50 text-red-800 border-red-200/50 dark:bg-red-950/30 dark:text-red-300 dark:border-red-500/20',
  };

  const icons = {
    info: (
      <svg className="w-5 h-5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {icons[variant]}
      <div className="flex-1 flex flex-col gap-0.5">
        {title && <span className="font-semibold">{title}</span>}
        <span className="opacity-95">{description}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 hover:opacity-75 focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
