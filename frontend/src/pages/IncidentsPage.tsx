import React, { useState } from 'react';
import { Incident } from '../types/agentTrust';
import { Badge } from '../components/common/Badge';
import {
  AlertTriangle,
  Search,
  ShieldAlert,
  CheckCircle2,
  Lock,
  User,
  Globe,
  Hash,
  XCircle,
} from 'lucide-react';

interface IncidentsPageProps {
  incidents: Incident[];
  onResolveIncident: (id: string) => void;
  onQuarantineAgent: (agentId: string) => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({
  incidents,
  onResolveIncident,
  onQuarantineAgent,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIncidents = incidents.filter(
    (inc) =>
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Security Incident Investigation Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Investigate intercepted adversarial prompt injections, DLP leaks, and unauthorized tool executions.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg">
            OPEN INCIDENTS: {incidents.filter((i) => i.status !== 'Resolved').length}
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search incidents..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedIncident?.id === inc.id
                    ? 'bg-rose-950/30 border-rose-500/80 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Badge type="risk" value={inc.riskLevel} />
                  <Badge type="incident" value={inc.status} />
                </div>

                <h4 className="font-bold text-white text-xs mb-1 line-clamp-1">{inc.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{inc.summary}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-900">
                  <span>Agent: <strong className="text-slate-300">{inc.agentName}</strong></span>
                  <span>{inc.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Investigation View (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {selectedIncident ? (
            <>
              {/* Header */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                    {selectedIncident.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge type="risk" value={selectedIncident.riskLevel} />
                    <Badge type="incident" value={selectedIncident.status} />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">{selectedIncident.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedIncident.summary}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                  <div>Agent: <strong className="text-cyan-400">{selectedIncident.agentName}</strong></div>
                  <div>IP: <span className="text-slate-200">{selectedIncident.ipAddress}</span></div>
                  <div>Category: <span className="text-amber-400">{selectedIncident.category}</span></div>
                </div>
              </div>

              {/* Raw Payload Inspection */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Raw Ingested Payload
                </h4>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-rose-300 whitespace-pre-wrap">
                  {selectedIncident.rawPrompt}
                </div>
              </div>

              {/* Blocked Tool Call */}
              {selectedIncident.blockedToolCall && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Intercepted Tool Invocation
                  </h4>
                  <div className="p-3 bg-slate-950 border border-rose-900/60 rounded-xl text-xs font-mono text-rose-400">
                    {selectedIncident.blockedToolCall}
                  </div>
                </div>
              )}

              {/* Applied Mitigation & Cryptographic Proof */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-[10px] font-bold uppercase text-slate-500">Applied Mitigation</div>
                <div className="text-emerald-400 font-medium">{selectedIncident.mitigationApplied}</div>
                <div className="text-[10px] font-mono text-slate-600 pt-1">Hash: {selectedIncident.hash}</div>
              </div>

              {/* Remediation Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onQuarantineAgent(selectedIncident.agentId)}
                  className="px-4 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Lock className="w-4 h-4" />
                  Quarantine Target Agent
                </button>

                {selectedIncident.status !== 'Resolved' && (
                  <button
                    onClick={() => onResolveIncident(selectedIncident.id)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Incident Resolved
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-slate-500">Select an incident to investigate</div>
          )}
        </div>
      </div>
    </div>
  );
};
