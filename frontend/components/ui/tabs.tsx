'use client';

import React from 'react';

interface TabOption {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex border-b border-surface-200/60 dark:border-surface-800/60 overflow-x-auto ${className}`}>
      <div className="flex gap-8">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`pb-4 text-sm font-semibold border-b-2 transition-all relative flex items-center gap-2 whitespace-nowrap focus:outline-none
                ${isActive
                  ? 'border-gold-500 text-gold-600 dark:text-gold-400 font-bold'
                  : 'border-transparent text-surface-500 hover:text-surface-800 dark:hover:text-surface-300'
                }
              `}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                  ${isActive
                    ? 'bg-gold-50 text-gold-600 dark:bg-gold-950/30 dark:text-gold-300'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
