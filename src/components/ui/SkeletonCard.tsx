import React from 'react';

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl glass-panel border border-slate-800 animate-pulse space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-4 bg-slate-800 rounded w-16"></div>
          </div>
          <div className="h-5 bg-slate-800 rounded w-3/4"></div>
          <div className="h-3 bg-slate-800/80 rounded w-full"></div>
          <div className="h-3 bg-slate-800/80 rounded w-4/5"></div>
          <div className="pt-2 flex justify-between items-center">
            <div className="h-6 bg-slate-800 rounded w-24"></div>
            <div className="h-9 bg-slate-800 rounded w-32"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
