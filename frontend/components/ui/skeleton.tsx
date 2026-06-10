'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  count = 1,
}) => {
  const baseStyle = 'animate-pulse bg-surface-200 dark:bg-surface-800';
  
  const variants = {
    text: 'h-4 rounded w-3/4 my-1.5',
    rect: 'rounded-xl h-24 w-full',
    circle: 'rounded-full h-12 w-12',
  };

  const skeletons = Array.from({ length: count });

  if (count > 1) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {skeletons.map((_, i) => (
          <div key={i} className={`${baseStyle} ${variants[variant]} ${className}`} />
        ))}
      </div>
    );
  }

  return <div className={`${baseStyle} ${variants[variant]} ${className}`} />;
};

export default Skeleton;
