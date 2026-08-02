import React from 'react';
import { Agent, Policy, Incident, ExecutionTrace, SystemMetrics } from '../types/agentTrust';
import { MetricCard } from '../components/common/MetricCard';
import { TrustScoreGauge } from '../components/common/TrustScoreGauge';
import { Badge } from '../components/common/Badge';
import { trustChartData, riskCategoryBreakdown } from '../mock/mockData';
import {
  ShieldCheck,
  Bot,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Activity,
  DollarSign,
  Clock,
  Lock,
  Terminal,
  FileCheck2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  metrics: SystemMetrics;
  agents: Agent[];
  incidents: Incident[];
  traces: ExecutionTrace[];
  onOpenSandbox: () => void;
  onSelectAgent: (agent: Agent) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  agents,
  incidents,
  traces,
  onOpenSandbox,
  onSelectAgent,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              ENT-SEC-PLATFORM v4.2
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Agent Security & Governance Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time policy enforcement, prompt injection defense, and cryptographic audit logs across {agents.length} enterprise autonomous agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSandbox}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all border border-cyan-400/30"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Simulate Attack</span>
          </button>
          <button
            onClick={() => navigate('/agents')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors border border-slate-700"
          >
            View Inventory
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Guarded Agents"
          value={`${metrics.activeAgents} / ${metrics.totalAgents}`}
          change="+2 new"
          changeType="positive"
          subtitle="All isolated in sandbox runtime"
          icon={Bot}
          iconColor="text-cyan-400"
        />
        <MetricCard
          title="Interceptions (24h)"
          value={metrics.blockedInvocations24h.toLocaleString()}
          change="99.8% blocked"
          changeType="positive"
          subtitle="Prompt injections & DLP leaks"
          icon={ShieldAlert}
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Critical Incidents"
          value={metrics.criticalIncidentsCount}
          change="Action required"
          changeType="negative"
          subtitle="Requires CISO investigation"
          icon={AlertTriangle}
          iconColor="text-rose-400"
        />
        <MetricCard
          title="Avg Defense Latency"
          value={`${metrics.avgLatencyMs} ms`}
          change="Sub-500ms SLA"
          changeType="positive"
          subtitle="Includes deep semantic evaluation"
          icon={Clock}
          iconColor="text-indigo-400"
        />
      </div>

      {/* Trust Gauge & Trend Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trust Gauge Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-sm">
          <div className="w-full text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enterprise Trust Index
            </span>
            <p className="text-xs text-slate-500 mt-1">Weighted score across all 18 agents</p>
          </div>

          <div className="my-6">
            <TrustScoreGauge score={metrics.trustIndex} size="lg" />
          </div>

          <div className="w-full space-y-2 pt-4 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Security Tier:</span>
              <span className="font-bold text-emerald-400">AAA (Highest Grade)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>DLP Shielding:</span>
              <span className="font-semibold text-cyan-400">100% Active</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Policy Compliance:</span>
              <span className="font-semibold text-emerald-400">99.8%</span>
            </div>
          </div>
        </div>

        {/* Realtime Threat Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Interceptions & Policy Shielding Activity (24h)
              </h3>
              <p className="text-xs text-slate-400">
                Real-time volume of blocked attacks vs policy violations over time
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-md">
              LIVE FEED
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trustChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attacksBlocked"
                  name="Attacks Blocked"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAttacks)"
                />
                <Area
                  type="monotone"
                  dataKey="violations"
                  name="Policy Violations"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViolations)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Incidents & Security Posture Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Incident Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Active Security Incidents
              </h3>
              <p className="text-xs text-slate-400">High severity policy violations requiring action</p>
            </div>
            <button
              onClick={() => navigate('/incidents')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View All ({incidents.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                onClick={() => navigate('/incidents')}
                className="p-3.5 bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge type="risk" value={inc.riskLevel} />
                    <span className="font-bold text-xs text-white truncate max-w-xs">{inc.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{inc.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{inc.summary}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                  <span>Agent: <strong className="text-slate-300">{inc.agentName}</strong></span>
                  <span className="font-mono text-cyan-400">{inc.mitigationApplied}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Posture Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Guardrail Health Posture
              </h3>
              <p className="text-xs text-slate-400">Efficacy rate across key AI defense vectors</p>
            </div>
          </div>

          <div className="space-y-4">
            {riskCategoryBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{item.count}</span>
                    <span className="font-bold text-emerald-400 font-mono">{item.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
