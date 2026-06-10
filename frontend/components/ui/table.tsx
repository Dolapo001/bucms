'use client';

import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-surface-200/60 dark:border-surface-800/60 ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-950 border-b border-surface-200/60 dark:border-surface-800/60">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100 dark:divide-surface-800/50 bg-white dark:bg-surface-900">
          {children}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-surface-50/50 dark:hover:bg-surface-800/20 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
  return (
    <td className={`px-6 py-4 text-sm text-surface-700 dark:text-surface-300 font-medium ${className}`}>
      {children}
    </td>
  );
};

export default Table;
