
import React from 'react';

interface ComplianceBadgeProps {
  percentage: number;
  label: string;
}

export const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({ percentage, label }) => {
  const isComplete = percentage === 100;
  
  return (
    <div className="flex flex-col items-center p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
      <div className="relative h-16 w-16 mb-2">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={175.9}
            strokeDashoffset={175.9 - (175.9 * percentage) / 100}
            className={`${isComplete ? 'text-emerald-500' : percentage > 0 ? 'text-orange-500' : 'text-slate-700'} transition-all duration-500`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold">
          {percentage}%
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</span>
    </div>
  );
};
