import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Activity,
  ShieldAlert,
  Terminal,
  FileCheck2,
  AlertTriangle,
  Settings,
  Shield,
  Cpu,
  PlusCircle,
  History,
  ShieldCheck,
  Wallet,
  Building2,
  Wrench,
  LogIn,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const primaryNavItems = [
    { path: '/', label: 'Trust Dashboard', icon: LayoutDashboard },
    { path: '/agents', label: 'Agent Inventory', icon: Bot, badge: '18' },
    { path: '/register-agent', label: 'Register Agent', icon: PlusCircle },
    { path: '/passport', label: 'Agent Passport', icon: FileCheck2 },
    { path: '/reputation-timeline', label: 'Reputation Timeline', icon: History },
  ];

  const securityNavItems = [
    { path: '/identity-health', label: 'Identity Health', icon: ShieldCheck },
    { path: '/wallet-binding', label: 'Wallet Binding', icon: Wallet },
    { path: '/organization-trust', label: 'Organization Trust', icon: Building2 },
    { path: '/skills-profile', label: 'Agent Skill Profile', icon: Wrench },
    { path: '/policies', label: 'Policy Engine', icon: ShieldAlert, badge: '6' },
    { path: '/sandbox', label: 'Attack Sandbox', icon: Terminal, highlight: true },
    { path: '/incidents', label: 'Incidents & Alerts', icon: AlertTriangle, badge: '2', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  ];

  const systemNavItems = [
    { path: '/monitoring', label: 'Live Telemetry', icon: Activity },
    { path: '/audit', label: 'Audit Trail', icon: FileCheck2 },
    { path: '/settings', label: 'Governance Config', icon: Settings },
    { path: '/login', label: 'Auth & Login', icon: LogIn },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 bg-slate-950 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50 border border-cyan-400/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                AgentTrust <span className="text-cyan-400 font-mono text-xs">OS</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold block">
                AI Security Platform
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4 space-y-4">
          {/* Group 1: Core Agent Governance */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Core Identity
            </div>
            {primaryNavItems.map((item) => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </div>

          {/* Group 2: Security & Controls */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Security & Bounds
            </div>
            {securityNavItems.map((item) => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </div>

          {/* Group 3: Operations & Config */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Operations & Auth
            </div>
            {systemNavItems.map((item) => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer System Status Card */}
      <div className="p-4 border-t border-slate-800/80 m-3 bg-slate-900/60 rounded-xl border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200">Sandbox Guard</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            v4.12
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Isolated runtime sandbox active for all 18 agent workers.
        </p>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  item: {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
    highlight?: boolean;
  };
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          isActive
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm font-semibold'
            : item.highlight
            ? 'text-slate-300 hover:bg-slate-900/80 hover:text-white border border-transparent'
            : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
        }`
      }
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4" />
        <span>{item.label}</span>
      </div>

      {item.badge && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
            item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
};
