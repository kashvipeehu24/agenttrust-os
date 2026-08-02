import React, { useState } from 'react';
import { Agent, Policy } from '../../types/agentTrust';
import { Modal } from '../common/Modal';
import { Bot, Shield, Plus, Cpu, Lock } from 'lucide-react';

interface NewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  policies: Policy[];
  onAddAgent: (newAgent: Agent) => void;
}

export const NewAgentModal: React.FC<NewAgentModalProps> = ({
  isOpen,
  onClose,
  policies,
  onAddAgent,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    codeName: '',
    description: '',
    department: 'Software Engineering',
    owner: '',
    model: 'Gemini 2.5 Pro',
    riskLevel: 'Medium' as Agent['riskLevel'],
    assignedPolicies: ['pol-001', 'pol-002'],
    permissions: {
      databaseRead: true,
      databaseWrite: false,
      shellExecution: false,
      emailSending: false,
      apiAccess: true,
      webBrowsing: false,
      fileSystemAccess: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.codeName) return;

    const newAgent: Agent = {
      id: `agt-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      codeName: formData.codeName.toUpperCase(),
      description: formData.description || 'Enterprise agent registered for governance tracking.',
      model: formData.model,
      version: '1.0.0',
      department: formData.department,
      owner: formData.owner || 'Security Ops',
      trustScore: 98.5,
      riskLevel: formData.riskLevel,
      status: 'Active',
      invocations24h: 0,
      policyViolations24h: 0,
      avgLatencyMs: 250,
      lastActive: 'Just now',
      createdDate: new Date().toISOString().split('T')[0],
      permissions: formData.permissions,
      assignedPolicies: formData.assignedPolicies,
      tags: [formData.department, 'New-Agent'],
    };

    onAddAgent(newAgent);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Agent in AgentTrust OS"
      subtitle="Provision security boundaries, capability permissions, and guardrails."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Agent Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sales Prospecting Bot"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Code Identifier *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SALES-BOT-V1"
              value={formData.codeName}
              onChange={(e) => setFormData({ ...formData, codeName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            rows={2}
            placeholder="Brief functional purpose and intended workflow..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Foundation Model</label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
              <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="GPT-4o">GPT-4o</option>
              <option value="Llama 3 70B">Llama 3 70B</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
            <input
              type="text"
              placeholder="Engineering"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Risk Tier</label>
            <select
              value={formData.riskLevel}
              onChange={(e) =>
                setFormData({ ...formData, riskLevel: e.target.value as Agent['riskLevel'] })
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>
          </div>
        </div>

        {/* Capability Privileges Checkbox matrix */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Capability Privileges
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {Object.keys(formData.permissions).map((permKey) => (
              <label
                key={permKey}
                className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700"
              >
                <input
                  type="checkbox"
                  checked={(formData.permissions as any)[permKey]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permissions: {
                        ...formData.permissions,
                        [permKey]: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20"
                />
                <span className="capitalize text-slate-300 text-[11px]">
                  {permKey.replace(/([A-Z])/g, ' $1')}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-950/40 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Register Agent
          </button>
        </div>
      </form>
    </Modal>
  );
};
