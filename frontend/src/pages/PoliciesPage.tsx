import React, { useState } from 'react';
import { Policy, RiskLevel, PolicyCategory } from '../types/agentTrust';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  ShieldAlert,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Code,
  ToggleLeft,
  ToggleRight,
  Shield,
  Layers,
} from 'lucide-react';

interface PoliciesPageProps {
  policies: Policy[];
  onTogglePolicy: (policyId: string) => void;
  onChangeMode: (policyId: string, mode: Policy['enforcementMode']) => void;
  onAddPolicy: (newPolicy: Policy) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  policies,
  onTogglePolicy,
  onChangeMode,
  onAddPolicy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  const categories = ['All', 'DLP', 'Prompt Injection', 'Tool Authorization', 'Hallucination', 'Compliance', 'Rate Limit'];

  const filteredPolicies = policies.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Enterprise Guardrail & Policy Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure prompt injection shields, DLP sanitization rules, tool invocation bounds, and autonomous rate caps.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/40 flex items-center gap-2 shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Policy Rule
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Policy List Grid */}
      <div className="space-y-4">
        {filteredPolicies.map((pol) => (
          <div
            key={pol.id}
            className={`p-5 rounded-2xl border transition-all ${
              pol.enabled
                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                : 'bg-slate-950/50 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl border mt-0.5 ${
                    pol.enabled
                      ? 'bg-cyan-950/50 text-cyan-400 border-cyan-800/60'
                      : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{pol.name}</h3>
                    <span className="text-[10px] font-mono text-slate-500">({pol.code})</span>
                    <Badge type="risk" value={pol.severity} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">{pol.description}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px]">Mode:</span>
                  <select
                    value={pol.enforcementMode}
                    onChange={(e) =>
                      onChangeMode(pol.id, e.target.value as Policy['enforcementMode'])
                    }
                    className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="Block & Alert" className="bg-slate-900 text-slate-200">
                      Block & Alert
                    </option>
                    <option value="Redact & Continue" className="bg-slate-900 text-slate-200">
                      Redact & Continue
                    </option>
                    <option value="Flag for Review" className="bg-slate-900 text-slate-200">
                      Flag for Review
                    </option>
                    <option value="Shadow Log" className="bg-slate-900 text-slate-200">
                      Shadow Log
                    </option>
                  </select>
                </div>

                <button
                  onClick={() => onTogglePolicy(pol.id)}
                  className={`p-1.5 rounded-xl transition-colors ${
                    pol.enabled ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-400'
                  }`}
                  title={pol.enabled ? 'Disable Policy' : 'Enable Policy'}
                >
                  {pol.enabled ? (
                    <ToggleRight className="w-7 h-7" />
                  ) : (
                    <ToggleLeft className="w-7 h-7" />
                  )}
                </button>
              </div>
            </div>

            {/* Rules Condition Breakdown */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2 mt-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Active Rules ({pol.rules.length})</span>
                <span>24h Triggers: <strong className="text-cyan-400">{pol.triggerCount24h}</strong></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {pol.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-2 bg-slate-900/90 border border-slate-800/60 rounded-lg text-slate-300 font-mono text-[11px] flex items-center justify-between"
                  >
                    <span className="truncate pr-2">IF: {rule.condition}</span>
                    <span className="text-cyan-400 font-bold shrink-0">THEN: {rule.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      <NewPolicyModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddPolicy={onAddPolicy}
      />
    </div>
  );
};

const NewPolicyModal = ({
  isOpen,
  onClose,
  onAddPolicy,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddPolicy: (p: Policy) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'DLP' as PolicyCategory,
    severity: 'High' as RiskLevel,
    description: '',
    enforcementMode: 'Block & Alert' as Policy['enforcementMode'],
    condition: '',
    action: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newPol: Policy = {
      id: `pol-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      code: `POL-CUSTOM-${Math.floor(Math.random() * 800) + 100}`,
      category: formData.category,
      severity: formData.severity,
      description: formData.description || 'Custom security policy rule.',
      enabled: true,
      enforcementMode: formData.enforcementMode,
      triggerCount24h: 0,
      rulesCount: 1,
      lastUpdated: new Date().toISOString().split('T')[0],
      targetAgentsCount: 18,
      rules: [
        {
          id: 'r-custom',
          condition: formData.condition || 'Custom payload match',
          action: formData.action || 'Intercept and sanitize',
        },
      ],
    };

    onAddPolicy(newPol);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Policy Rule"
      subtitle="Deploy a new rule across all enterprise agent runtime environments."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Policy Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Block SQL Drop Table Syntax"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as PolicyCategory })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="DLP">DLP</option>
              <option value="Prompt Injection">Prompt Injection</option>
              <option value="Tool Authorization">Tool Authorization</option>
              <option value="Hallucination">Hallucination</option>
              <option value="Compliance">Compliance</option>
              <option value="Rate Limit">Rate Limit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Severity</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as RiskLevel })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Enforcement</label>
            <select
              value={formData.enforcementMode}
              onChange={(e) => setFormData({ ...formData, enforcementMode: e.target.value as Policy['enforcementMode'] })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="Block & Alert">Block & Alert</option>
              <option value="Redact & Continue">Redact & Continue</option>
              <option value="Flag for Review">Flag for Review</option>
              <option value="Shadow Log">Shadow Log</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of threat pattern..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">IF Condition (Regex / Pattern)</label>
            <input
              type="text"
              placeholder="e.g. Regex DROP TABLE"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">THEN Action</label>
            <input
              type="text"
              placeholder="e.g. Block SQL Execution"
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg"
          >
            Deploy Policy Rule
          </button>
        </div>
      </form>
    </Modal>
  );
};
