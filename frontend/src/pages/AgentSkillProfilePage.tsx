import React, { useState } from 'react';
import { mockAgentSkills } from '../mock/mockData';
import { AgentSkill } from '../types/agentTrust';
import { Badge } from '../components/common/Badge';
import {
  Wrench,
  ShieldAlert,
  Code2,
  CheckCircle2,
  Lock,
  Search,
  Cpu,
  Terminal,
} from 'lucide-react';

export const AgentSkillProfilePage: React.FC = () => {
  const [skills, setSkills] = useState<AgentSkill[]>(mockAgentSkills);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = skills.filter(
    (skl) =>
      skl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skl.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            Agent Skill Profile & Tool Signature Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Whitelisted tool signatures, argument boundary schemas, approved model engines, and invocation telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-xl">
            APPROVED SKILLS: {skills.filter((s) => s.status === 'Approved').length} / {skills.length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative bg-slate-900 p-4 border border-slate-800 rounded-2xl">
        <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills by name, code, or tool signature..."
          className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map((skl) => (
          <div
            key={skl.id}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
                  {skl.code}
                </span>
                <h3 className="font-bold text-sm text-white">{skl.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge type="risk" value={skl.riskRating} />
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
                    skl.status === 'Approved'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  {skl.status}
                </span>
              </div>
            </div>

            {/* Tool Signature */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                Whitelisted Tool Signature
              </span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 break-all">
                {skl.toolSignature}
              </div>
            </div>

            {/* Parameters Schema */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                Parameter Bounds & Regex Schema
              </span>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300">
                {skl.parametersSchema}
              </div>
            </div>

            {/* Approved Models & Executions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400 text-[10px]">
                  Approved: <strong className="text-white">{skl.approvedModels.join(', ')}</strong>
                </span>
              </div>

              <span className="text-[10px] text-slate-400">
                24h Runs: <strong className="text-cyan-400">{skl.executionCount24h.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
