import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  icon: Icon,
  iconColor = 'text-cyan-400',
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/80 transition-all shadow-sm hover:shadow-cyan-950/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-lg bg-slate-800/70 border border-slate-700/50 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              changeType === 'positive'
                ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/50'
                : changeType === 'negative'
                ? 'text-rose-400 bg-rose-950/50 border border-rose-800/50'
                : 'text-slate-400 bg-slate-800 border border-slate-700'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
    </div>
  );
};
