import React, { useState } from 'react';
import { mockReputationEvents } from '../mock/mockData';
import { ReputationEvent } from '../types/agentTrust';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  History,
  CheckCircle2,
  Filter,
  Search,
  Award,
} from 'lucide-react';

export const ReputationTimelinePage: React.FC = () => {
  const [events, setEvents] = useState<ReputationEvent[]>(mockReputationEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((evt) => {
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Agent Reputation & Trust History Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of trust score adjustments, security audit certifications, SLA uptime rewards, and policy penalties.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-xl">
            GLOBAL REPUTATION INDEX: 98.4
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-2xl text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search timeline events..."
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Security Audit', 'Policy Compliance', 'Incident Violation', 'SLA Uptime', 'Model Patch'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-600 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
          {filteredEvents.map((evt) => {
            const isPositive = evt.scoreDelta > 0;
            return (
              <div key={evt.id} className="relative group">
                {/* Timeline Node Icon */}
                <div
                  className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                    isPositive
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-600'
                      : 'bg-rose-950 text-rose-400 border-rose-600'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>

                {/* Event Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{evt.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                        {evt.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-lg border ${
                          isPositive
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : 'bg-rose-950/80 text-rose-400 border-rose-800'
                        }`}
                      >
                        {isPositive ? `+${evt.scoreDelta}` : evt.scoreDelta} PTS
                      </span>
                      <span className="text-slate-400 font-semibold">Score: {evt.resultingScore}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                    <span>Agent: <strong className="text-cyan-400">{evt.agentName}</strong></span>
                    <span>Verifier: <span className="text-slate-300">{evt.verifier}</span></span>
                    <span>{evt.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
