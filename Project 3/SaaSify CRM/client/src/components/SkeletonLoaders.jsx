import React from 'react';

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 w-24 shimmer rounded"></div>
            <div className="h-8 w-8 shimmer rounded-lg"></div>
          </div>
          <div className="h-8 w-16 shimmer rounded mb-2"></div>
          <div className="h-3 w-32 shimmer rounded"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="w-full border border-slate-200/50 dark:border-slate-800/60 rounded-2xl overflow-hidden bg-white dark:bg-[#121826]/20">
      <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4">
        <div className="h-10 w-64 shimmer rounded-xl"></div>
        <div className="flex gap-2">
          <div className="h-10 w-28 shimmer rounded-xl"></div>
          <div className="h-10 w-28 shimmer rounded-xl"></div>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-850">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex items-center p-4 gap-4">
            <div className="flex-1">
              <div className="h-4 w-40 shimmer rounded mb-2"></div>
              <div className="h-3.5 w-60 shimmer rounded"></div>
            </div>
            <div className="w-24 h-6 shimmer rounded-full"></div>
            <div className="w-28 h-4 shimmer rounded"></div>
            <div className="w-24 h-6 shimmer rounded-full"></div>
            <div className="w-16 h-8 shimmer rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40 h-80 flex flex-col justify-between">
      <div className="h-5 w-40 shimmer rounded"></div>
      <div className="flex-1 flex items-end gap-4 mt-6">
        {[40, 70, 50, 90, 30, 80, 60, 45].map((height, idx) => (
          <div
            key={idx}
            style={{ height: `${height}%` }}
            className="flex-1 shimmer rounded-t"
          ></div>
        ))}
      </div>
    </div>
  );
};

export const ActivitySkeleton = () => {
  return (
    <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40">
      <div className="h-5 w-36 shimmer rounded mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full shimmer flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 shimmer rounded"></div>
              <div className="h-3 w-1/4 shimmer rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
