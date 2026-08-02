import React, { useState } from 'react';
import { ExecutionTrace } from '../types/agentTrust';
import { Badge } from '../components/common/Badge';
import {
  Activity,
  Search,
  Terminal,
  ShieldCheck,
  ShieldAlert,
  Clock,
  DollarSign,
  AlertTriangle,
  FileCode,
  Filter,
} from 'lucide-react';

interface MonitoringPageProps {
  traces: ExecutionTrace[];
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({ traces }) => {
  const [selectedTrace, setSelectedTrace] = useState<ExecutionTrace | null>(traces[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTraces = traces.filter((tr) => {
    const matchesStatus = statusFilter === 'All' || tr.status === statusFilter;
    const matchesQuery =
      tr.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.response.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Live Execution Telemetry & Guardrail Inspector
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time prompt ingestion, tool interception, PII scrubbing, and token usage telemetry.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <span className="text-slate-500 block text-[10px] uppercase">Traces Logged</span>
            <span className="font-bold text-cyan-400">{traces.length}</span>
          </div>
          <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <span className="text-slate-500 block text-[10px] uppercase">Interceptions</span>
            <span className="font-bold text-rose-400">
              {traces.filter((t) => t.status === 'Blocked').length}
            </span>
          </div>
          <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <span className="text-slate-500 block text-[10px] uppercase">Scrubbed PII</span>
            <span className="font-bold text-amber-400">
              {traces.filter((t) => t.status === 'Sanitized').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Trace Feed vs Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trace List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search traces..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">All Verdicts</option>
              <option value="Allowed">Allowed</option>
              <option value="Sanitized">Sanitized</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredTraces.map((tr) => (
              <div
                key={tr.id}
                onClick={() => setSelectedTrace(tr)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedTrace?.id === tr.id
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white truncate">{tr.agentName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      tr.status === 'Blocked'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : tr.status === 'Sanitized'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {tr.status}
                  </span>
                </div>

                <p className="text-slate-400 line-clamp-2 text-[11px] font-mono bg-slate-900/80 p-2 rounded border border-slate-800/50 mb-2">
                  {tr.prompt}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{tr.timestamp}</span>
                  <span>{tr.latencyMs}ms • {tr.tokensUsed} tokens</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {selectedTrace ? (
            <>
              {/* Top Summary */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Trace ID</span>
                    <h3 className="font-mono text-sm font-bold text-cyan-400">{selectedTrace.id}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Timestamp</span>
                    <div className="text-xs font-mono text-slate-300">{selectedTrace.timestamp}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Verdict</span>
                    <span
                      className={`font-bold ${
                        selectedTrace.status === 'Blocked'
                          ? 'text-rose-400'
                          : selectedTrace.status === 'Sanitized'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedTrace.status}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Risk Score</span>
                    <span className="font-bold text-amber-400 font-mono">{selectedTrace.riskScore} / 100</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Latency</span>
                    <span className="font-mono text-slate-200">{selectedTrace.latencyMs} ms</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Cost</span>
                    <span className="font-mono text-slate-200">${selectedTrace.costUsd}</span>
                  </div>
                </div>
              </div>

              {/* Detected Violations */}
              {selectedTrace.detectedViolations.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Detected Guardrail Violations ({selectedTrace.detectedViolations.length})
                  </h4>
                  {selectedTrace.detectedViolations.map((v, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs font-mono text-rose-300 flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Ingested Prompt */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Ingested Prompt Payload
                </h4>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedTrace.prompt}
                </div>
              </div>

              {/* Tool Execution Interceptions */}
              {selectedTrace.toolCalls && selectedTrace.toolCalls.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Intercepted Tool Calls ({selectedTrace.toolCalls.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedTrace.toolCalls.map((tc, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                          tc.allowed
                            ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                        }`}
                      >
                        <div>
                          <span className="font-bold">{tc.toolName}</span>
                          <div className="text-[11px] opacity-80 mt-1">
                            Args: {JSON.stringify(tc.params)}
                          </div>
                        </div>
                        <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-current">
                          {tc.allowed ? 'Approved' : 'Intercepted'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Output Generation / Sanitized Response */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Sanitized Agent Output Generation
                </h4>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 leading-relaxed">
                  {selectedTrace.response}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500">Select a trace to inspect telemetry</div>
          )}
        </div>
      </div>
    </div>
  );
};
