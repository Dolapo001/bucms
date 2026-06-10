'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const uniqueId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={uniqueId}
            className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-surface-400 dark:text-surface-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            id={uniqueId}
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-1 bg-white dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-600
              ${leftIcon ? 'pl-11' : ''}
              ${rightIcon ? 'pr-11' : ''}
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-surface-200 dark:border-surface-800 focus:border-gold-500 focus:ring-gold-500/20'
              }
              ${className}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 text-surface-400 dark:text-surface-500">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs font-semibold text-red-500 animate-fadeIn">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-surface-500 dark:text-surface-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
