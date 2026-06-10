'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors';
  
  const variants = {
    primary: 'bg-primary-50 text-primary-700 border-primary-200/30 dark:bg-primary-950/30 dark:text-primary-300 dark:border-primary-500/20',
    secondary: 'bg-surface-100 text-surface-700 border-surface-200/50 dark:bg-surface-800 dark:text-surface-300 dark:border-surface-700',
    gold: 'bg-gold-50 text-gold-700 border-gold-200/30 dark:bg-gold-950/30 dark:text-gold-300 dark:border-gold-500/20',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/30 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-500/20',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/30 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-500/20',
    danger: 'bg-red-50 text-red-700 border-red-200/30 dark:bg-red-950/30 dark:text-red-300 dark:border-red-500/20',
    info: 'bg-blue-50 text-blue-700 border-blue-200/30 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-500/20',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
