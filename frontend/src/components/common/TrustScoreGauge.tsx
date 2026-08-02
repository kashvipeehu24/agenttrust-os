import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface TrustScoreGaugeProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const TrustScoreGauge: React.FC<TrustScoreGaugeProps> = ({
  score,
  size = 'md',
  label = 'Overall Trust Index',
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 95) return 'text-emerald-400 stroke-emerald-500';
    if (val >= 85) return 'text-cyan-400 stroke-cyan-500';
    if (val >= 70) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const dimensions = size === 'lg' ? 180 : size === 'md' ? 120 : 80;
  const strokeWidth = size === 'lg' ? 12 : size === 'md' ? 8 : 6;
  const radius = (dimensions - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={dimensions} height={dimensions} className="transform -rotate-90">
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <ShieldCheck className={`w-5 h-5 mb-0.5 ${getScoreColor(score).split(' ')[0]}`} />
          <span
            className={`font-black tracking-tight text-white ${
              size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-base'
            }`}
          >
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Score
          </span>
        </div>
      </div>

      {label && (
        <span className="text-xs font-medium text-slate-300 mt-2 text-center">
          {label}
        </span>
      )}
    </div>
  );
};
