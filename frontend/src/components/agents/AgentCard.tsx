import React from 'react';
import { Agent } from '../../types/agentTrust';
import { Badge } from '../common/Badge';
import { ShieldCheck, Cpu, Terminal, Database, Mail, Globe, HardDrive } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
  onSimulate: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect, onSimulate }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                {agent.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">{agent.codeName}</p>
            </div>
          </div>

          <Badge type="status" value={agent.status} />
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 h-8 leading-relaxed">
          {agent.description}
        </p>

        {/* Key Metrics row */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4 text-center">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Trust</div>
            <div
              className={`text-sm font-extrabold ${
                agent.trustScore >= 95
                  ? 'text-emerald-400'
                  : agent.trustScore >= 85
                  ? 'text-cyan-400'
                  : 'text-amber-400'
              }`}
            >
              {agent.trustScore}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Risk Tier</div>
            <div className="text-xs font-semibold mt-0.5">
              <Badge type="risk" value={agent.riskLevel} />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Violations</div>
            <div
              className={`text-sm font-extrabold ${
                agent.policyViolations24h > 0 ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              {agent.policyViolations24h}
            </div>
          </div>
        </div>

        {/* Permissions Icons */}
        <div className="flex items-center justify-between text-slate-400 text-xs mb-4">
          <span className="text-[11px] font-medium text-slate-500">Capabilities:</span>
          <div className="flex items-center gap-2">
            <span title="Database Read/Write">
              <Database
                className={`w-3.5 h-3.5 ${
                  agent.permissions.databaseRead ? 'text-cyan-400' : 'text-slate-700'
                }`}
              />
            </span>
            <span title="Shell Command Execution">
              <Terminal
                className={`w-3.5 h-3.5 ${
                  agent.permissions.shellExecution ? 'text-rose-400' : 'text-slate-700'
                }`}
              />
            </span>
            <span title="Email Sending">
              <Mail
                className={`w-3.5 h-3.5 ${
                  agent.permissions.emailSending ? 'text-amber-400' : 'text-slate-700'
                }`}
              />
            </span>
            <span title="Web Browsing">
              <Globe
                className={`w-3.5 h-3.5 ${
                  agent.permissions.webBrowsing ? 'text-emerald-400' : 'text-slate-700'
                }`}
              />
            </span>
            <span title="File System Access">
              <HardDrive
                className={`w-3.5 h-3.5 ${
                  agent.permissions.fileSystemAccess ? 'text-blue-400' : 'text-slate-700'
                }`}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
        <button
          onClick={() => onSelect(agent)}
          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
        >
          Inspect Governance
        </button>
        <button
          onClick={() => onSimulate(agent)}
          className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Test
        </button>
      </div>
    </div>
  );
};
