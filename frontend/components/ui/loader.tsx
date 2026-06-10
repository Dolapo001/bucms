'use client';

import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  overlay?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  className = '',
  overlay = false,
}) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer spinning ring */}
      <div
        className={`animate-spin rounded-full border-t-gold-500 border-r-transparent border-b-primary-800 border-l-transparent ${sizes[size]}`}
      />
      {/* Subtle pulsing center dot */}
      <div className={`absolute rounded-full bg-gold-500/20 animate-ping
        ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'}
      `} />
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 bg-white/70 dark:bg-surface-950/70 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-sm font-semibold tracking-widest text-primary-800 dark:text-gold-400 uppercase">
            Bowen Chapel Management System
          </p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loader;
