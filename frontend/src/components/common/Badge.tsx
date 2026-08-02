import React from 'react';
import { RiskLevel, AgentStatus, IncidentStatus } from '../../types/agentTrust';

interface BadgeProps {
  type?: 'risk' | 'status' | 'incident' | 'custom';
  value: RiskLevel | AgentStatus | IncidentStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type = 'custom', value, className = '' }) => {
  let styleClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (type === 'risk') {
    switch (value) {
      case 'Low':
        styleClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        break;
      case 'Medium':
        styleClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        break;
      case 'High':
        styleClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
        break;
      case 'Critical':
        styleClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse';
        break;
    }
  } else if (type === 'status') {
    switch (value) {
      case 'Active':
        styleClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        break;
      case 'Sandboxed':
        styleClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        break;
      case 'Suspended':
        styleClasses = 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        break;
      case 'Quarantined':
        styleClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        break;
    }
  } else if (type === 'incident') {
    switch (value) {
      case 'Open':
        styleClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        break;
      case 'Investigating':
        styleClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        break;
      case 'Resolved':
        styleClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        break;
      case 'Ignored':
        styleClasses = 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {value}
    </span>
  );
};
