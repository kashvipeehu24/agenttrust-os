import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Agent, Policy } from '../types/agentTrust';
import {
  Bot,
  Plus,
  ShieldCheck,
  Key,
  Sliders,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';

interface RegisterAgentPageProps {
  policies: Policy[];
  onAddAgent: (agent: Agent) => void;
}

export const RegisterAgentPage: React.FC<RegisterAgentPageProps> = ({
  policies,
  onAddAgent,
}) => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [codeName, setCodeName] = useState('');
  const [description, setDescription] = useState('');
  const [model, setModel] = useState('Gemini 2.5 Pro');
  const [department, setDepartment] = useState('Finance & Accounting');
  const [owner, setOwner] = useState('Elena Rostova (CFO Office)');
  const [riskLevel, setRiskLevel] = useState<Agent['riskLevel']>('Medium');

  const [permissions, setPermissions] = useState({
    databaseRead: true,
    databaseWrite: false,
    shellExecution: false,
    emailSending: true,
    apiAccess: true,
    webBrowsing: false,
    fileSystemAccess: false,
  });

  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>(['pol-001', 'pol-002']);
  const [isSuccess, setIsSuccess] = useState(false);

  const togglePolicy = (id: string) => {
    setSelectedPolicyIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !codeName) return;

    const newAgent: Agent = {
      id: `agt-${Date.now().toString().slice(-3)}`,
      name,
      codeName: codeName.toUpperCase(),
      description: description || 'Autonomous multi-step execution agent registered under Zero-Trust guardrails.',
      model,
      version: '1.0.0-prod',
      department,
      owner,
      trustScore: 98.5,
      riskLevel,
      status: 'Active',
      invocations24h: 0,
      policyViolations24h: 0,
      avgLatencyMs: 240,
      lastActive: 'Just registered',
      createdDate: new Date().toISOString().split('T')[0],
      permissions,
      assignedPolicies: selectedPolicyIds,
      tags: ['New-Agent', department.split(' ')[0], model.split(' ')[0]],
    };

    onAddAgent(newAgent);
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/agents');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            Provision & Register Autonomous Agent
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate digital passport, assign guardrail policies, and set sandbox permission bounds.
          </p>
        </div>

        <button
          onClick={() => navigate('/agents')}
          className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
        >
          Cancel & Return
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Basic Identity & Model Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              Agent Identity & Owner Details
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Agent Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Treasury Automated Payment Bot"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">System Code Name / Identifier</label>
                <input
                  type="text"
                  value={codeName}
                  onChange={(e) => setCodeName(e.target.value)}
                  placeholder="e.g. FIN-TREASURY-PAY-V1"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-400 mb-1 font-medium">Functional Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe agent responsibilities, execution triggers, and operational scope..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">AI Model Engine</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
                  <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  <option value="GPT-4o">GPT-4o</option>
                  <option value="Llama 3 70B">Llama 3 70B</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Infrastructure & Cloud">Infrastructure & Cloud</option>
                  <option value="Customer Experience">Customer Experience</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Healthcare Operations">Healthcare Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Inherent Risk Tier</label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Critical">Critical Risk</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sandbox Permission Matrix */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              Sandbox Capability Bounds & Access Permissions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { key: 'databaseRead', label: 'Database Read' },
                { key: 'databaseWrite', label: 'Database Write' },
                { key: 'shellExecution', label: 'Shell Execution (SSH)' },
                { key: 'emailSending', label: 'Email Dispatch' },
                { key: 'apiAccess', label: 'External REST API' },
                { key: 'webBrowsing', label: 'Web Browsing / Scraping' },
                { key: 'fileSystemAccess', label: 'Local File System' },
              ].map((perm) => (
                <label
                  key={perm.key}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    (permissions as any)[perm.key]
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-slate-200'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="font-medium">{perm.label}</span>
                  <input
                    type="checkbox"
                    checked={(permissions as any)[perm.key]}
                    onChange={(e) =>
                      setPermissions((prev) => ({
                        ...prev,
                        [perm.key]: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Assigned Guardrails & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Assign Guardrail Policies
            </h3>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 text-xs">
              {policies.map((pol) => {
                const isSelected = selectedPolicyIds.includes(pol.id);
                return (
                  <div
                    key={pol.id}
                    onClick={() => togglePolicy(pol.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{pol.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">{pol.code}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{pol.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            {isSuccess ? (
              <span className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" /> Agent Registered & Passport Issued!
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Issue Passport & Register Agent</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
