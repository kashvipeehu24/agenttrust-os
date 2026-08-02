import React, { useState } from 'react';
import { Agent, Policy } from '../../types/agentTrust';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { TrustScoreGauge } from '../common/TrustScoreGauge';
import {
  ShieldAlert,
  Database,
  Terminal,
  Mail,
  Globe,
  HardDrive,
  Lock,
  Unlock,
  AlertOctagon,
  CheckCircle2,
  Cpu,
  User,
  Clock,
  Settings,
} from 'lucide-react';

interface AgentDetailModalProps {
  agent: Agent | null;
  policies: Policy[];
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (agentId: string, newStatus: Agent['status']) => void;
  onSimulate: (agent: Agent) => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  policies,
  isOpen,
  onClose,
  onStatusChange,
  onSimulate,
}) => {
  if (!agent) return null;

  const assignedPolicyObjects = policies.filter((p) => agent.assignedPolicies.includes(p.id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${agent.name} (${agent.codeName})`}
      subtitle={`Department: ${agent.department} • Model: ${agent.model}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="flex items-center justify-center border-r border-slate-800/80 pr-4">
            <TrustScoreGauge score={agent.trustScore} size="md" label="Trust Score" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Risk Tier:</span>
              <Badge type="risk" value={agent.riskLevel} />
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Status:</span>
              <Badge type="status" value={agent.status} />
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Owner:</span>
              <span className="text-slate-200 font-medium">{agent.owner}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Invocations (24h):</span>
              <span className="text-cyan-400 font-mono font-bold">
                {agent.invocations24h.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs pl-2 border-l border-slate-800/80">
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Avg Latency:</span>
              <span className="text-slate-200 font-mono">{agent.avgLatencyMs} ms</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Violations (24h):</span>
              <span
                className={`font-mono font-bold ${
                  agent.policyViolations24h > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {agent.policyViolations24h}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Last Active:</span>
              <span className="text-slate-300 font-mono">{agent.lastActive}</span>
            </div>
          </div>
        </div>

        {/* Status Actions */}
        <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Governance & State Override
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Change agent isolation level or quarantine immediately if suspicious behavior is observed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {agent.status !== 'Active' && (
              <button
                onClick={() => onStatusChange(agent.id, 'Active')}
                className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Activate Agent
              </button>
            )}

            {agent.status !== 'Sandboxed' && (
              <button
                onClick={() => onStatusChange(agent.id, 'Sandboxed')}
                className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Restrict to Sandbox
              </button>
            )}

            {agent.status !== 'Quarantined' && (
              <button
                onClick={() => onStatusChange(agent.id, 'Quarantined')}
                className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                Quarantine
              </button>
            )}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Capability & Privilege Boundaries
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <PermissionToggle
              label="Database Read"
              icon={Database}
              enabled={agent.permissions.databaseRead}
            />
            <PermissionToggle
              label="Database Write"
              icon={Database}
              enabled={agent.permissions.databaseWrite}
              warning
            />
            <PermissionToggle
              label="Shell Exec"
              icon={Terminal}
              enabled={agent.permissions.shellExecution}
              danger
            />
            <PermissionToggle
              label="Email Dispatch"
              icon={Mail}
              enabled={agent.permissions.emailSending}
            />
            <PermissionToggle
              label="API Access"
              icon={Globe}
              enabled={agent.permissions.apiAccess}
            />
            <PermissionToggle
              label="Web Browsing"
              icon={Globe}
              enabled={agent.permissions.webBrowsing}
            />
            <PermissionToggle
              label="File System Access"
              icon={HardDrive}
              enabled={agent.permissions.fileSystemAccess}
              warning
            />
          </div>
        </div>

        {/* Attached Guardrail Policies */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Enforced Guardrail Policies ({assignedPolicyObjects.length})
          </h4>
          <div className="space-y-2">
            {assignedPolicyObjects.map((pol) => (
              <div
                key={pol.id}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white">{pol.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">
                      ({pol.code})
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{pol.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <span className="px-2 py-0.5 text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded font-semibold">
                    {pol.enforcementMode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-between">
          <button
            onClick={() => {
              onClose();
              onSimulate(agent);
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            Launch Attack Simulator for {agent.name}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

const PermissionToggle = ({
  label,
  icon: Icon,
  enabled,
  warning,
  danger,
}: {
  label: string;
  icon: any;
  enabled: boolean;
  warning?: boolean;
  danger?: boolean;
}) => (
  <div
    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
      enabled
        ? danger
          ? 'bg-rose-950/30 border-rose-800/60 text-rose-300'
          : warning
          ? 'bg-amber-950/30 border-amber-800/60 text-amber-300'
          : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
        : 'bg-slate-950/40 border-slate-800/60 text-slate-600'
    }`}
  >
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      <span className="font-semibold">{label}</span>
    </div>
    <span className="text-[10px] font-mono font-bold uppercase">
      {enabled ? 'Allowed' : 'Blocked'}
    </span>
  </div>
);
