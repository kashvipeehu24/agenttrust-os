import React, { useState } from 'react';
import { Search, Shield, Bell, Zap, Terminal, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenSandbox?: () => void;
  openIncidentsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSandbox, openIncidentsCount = 2 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/agents?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 md:w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search agents, policy rules, logs..."
          className="w-full pl-10 pr-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-slate-500 bg-slate-800 border border-slate-700 rounded font-mono">
          ⌘K
        </kbd>
      </form>

      {/* Center Live Shield Status */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>SENTINEL ACTIVE</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">TRUST SCORE: 98.4</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Sandbox Quick Simulator */}
        <button
          onClick={() => {
            if (onOpenSandbox) onOpenSandbox();
            else navigate('/sandbox');
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-950/40 transition-all border border-cyan-400/30"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Attack</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => navigate('/incidents')}
          className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
          title="Incident Alerts"
        >
          <Bell className="w-4 h-4" />
          {openIncidentsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
              {openIncidentsCount}
            </span>
          )}
        </button>

        {/* Profile / Role Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-cyan-300/30">
            VP
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">Vikram Patel</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-cyan-400" /> CISO / Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
