'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  animate = false,
  ...props
}) => {
  const baseStyles = `rounded-2xl border bg-white dark:bg-surface-900 border-surface-200/60 dark:border-surface-800/60 shadow-card transition-all duration-300`;
  const hoverStyles = hoverEffect ? 'hover:shadow-card-hover hover:-translate-y-1' : '';
  const glassStyles = glass ? 'bg-white/70 dark:bg-surface-900/70 backdrop-blur-md shadow-glass border-white/20' : '';

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={hoverEffect ? { y: -4, boxShadow: '0 20px 40px -4px rgba(15, 30, 54, 0.08)' } : undefined}
        className={`${baseStyles} ${hoverStyles} ${glassStyles} ${className}`}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${glassStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-4 border-b border-surface-100 dark:border-surface-800/40 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-4 border-t border-surface-100 dark:border-surface-800/40 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
