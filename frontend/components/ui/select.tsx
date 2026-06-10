'use client';

import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const uniqueId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

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
          <select
            id={uniqueId}
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-1 bg-white dark:bg-surface-950 text-surface-900 dark:text-white appearance-none cursor-pointer
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-surface-200 dark:border-surface-800 focus:border-gold-500 focus:ring-gold-500/20'
              }
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute right-4 pointer-events-none text-surface-400 dark:text-surface-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
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

Select.displayName = 'Select';
export default Select;
