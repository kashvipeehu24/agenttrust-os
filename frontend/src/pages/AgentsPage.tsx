import React, { useState } from 'react';
import { Agent, Policy } from '../types/agentTrust';
import { AgentCard } from '../components/agents/AgentCard';
import { AgentDetailModal } from '../components/agents/AgentDetailModal';
import { NewAgentModal } from '../components/agents/NewAgentModal';
import { Badge } from '../components/common/Badge';
import {
  Bot,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  ShieldAlert,
  Cpu,
  Lock,
  Zap,
} from 'lucide-react';

interface AgentsPageProps {
  agents: Agent[];
  policies: Policy[];
  onStatusChange: (agentId: string, newStatus: Agent['status']) => void;
  onAddAgent: (newAgent: Agent) => void;
  onSimulate: (agent: Agent) => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({
  agents,
  policies,
  onStatusChange,
  onAddAgent,
  onSimulate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAgents = agents.filter((agent) => {
    const matchesQuery =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || agent.status === selectedStatus;
    const matchesRisk = selectedRisk === 'All' || agent.riskLevel === selectedRisk;

    return matchesQuery && matchesStatus && matchesRisk;
  });

  const handleOpenDetail = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            Agent Inventory & Governance Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered enterprise AI agents, security isolation states, capability privileges, and active guardrails.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/40 flex items-center gap-2 shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Register New Agent
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, model, department, tag..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status & Risk Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Sandboxed">Sandboxed</option>
            <option value="Suspended">Suspended</option>
            <option value="Quarantined">Quarantined</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Risk Tiers</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical Risk</option>
          </select>

          {/* Grid/List View switch */}
          <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-lg ml-auto md:ml-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${
                viewMode === 'list' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Agent Cards Display */}
      {filteredAgents.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <Bot className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No agents match your search criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting search filters or adding a new agent.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((ag) => (
            <AgentCard
              key={ag.id}
              agent={ag}
              onSelect={handleOpenDetail}
              onSimulate={onSimulate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800 text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Agent Identifier</th>
                <th className="p-4">Model & Department</th>
                <th className="p-4">Trust Index</th>
                <th className="p-4">Risk Tier</th>
                <th className="p-4">Status</th>
                <th className="p-4">Violations (24h)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAgents.map((ag) => (
                <tr key={ag.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{ag.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{ag.codeName}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-200">{ag.model}</div>
                    <div className="text-[10px] text-slate-500">{ag.department}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{ag.trustScore}%</td>
                  <td className="p-4">
                    <Badge type="risk" value={ag.riskLevel} />
                  </td>
                  <td className="p-4">
                    <Badge type="status" value={ag.status} />
                  </td>
                  <td className="p-4 font-mono">
                    <span className={ag.policyViolations24h > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {ag.policyViolations24h}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenDetail(ag)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded font-medium"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => onSimulate(ag)}
                      className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[11px] rounded font-medium"
                    >
                      Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      <AgentDetailModal
        agent={selectedAgent}
        policies={policies}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStatusChange={onStatusChange}
        onSimulate={onSimulate}
      />

      {/* New Agent Modal */}
      <NewAgentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        policies={policies}
        onAddAgent={onAddAgent}
      />
    </div>
  );
};
