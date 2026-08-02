import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Bell,
  Users,
  Database,
  CheckCircle2,
  Lock,
  Webhook,
  Sliders,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [sensitivity, setSensitivity] = useState<'Strict' | 'Balanced' | 'Permissive'>('Strict');
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [dlpStrictness, setDlpStrictness] = useState(95);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Governance & System Security Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global guardrail thresholds, SIEM integrations, RBAC permissions, and KMS key management.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccess ? 'Configuration Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Guardrail Sensitivity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Global Guardrail Sensitivity Level
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {(['Strict', 'Balanced', 'Permissive'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSensitivity(level)}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                  sensitivity === level
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>{level}</div>
                <div className="text-[10px] text-slate-500 mt-1 font-normal">
                  {level === 'Strict'
                    ? 'Zero-Trust (Zero Hallucination)'
                    : level === 'Balanced'
                    ? 'Standard Enterprise'
                    : 'Developer Sandbox'}
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Auto-Quarantine Rogue Agents</span>
                <p className="text-slate-400 text-[11px]">
                  Automatically isolate agent to Sandbox state after 3 critical policy violations.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoQuarantine}
                onChange={(e) => setAutoQuarantine(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>DLP Entity Confidence Threshold ({dlpStrictness}%)</span>
              </div>
              <input
                type="range"
                min={70}
                max={99}
                value={dlpStrictness}
                onChange={(e) => setDlpStrictness(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* SIEM & Webhook Integrations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Webhook className="w-4 h-4 text-cyan-400" />
            SIEM & Incident Dispatch Webhooks
          </h3>

          <div className="space-y-2 text-xs">
            <IntegrationRow name="Datadog Logs & Metrics" status="Connected" url="https://http-intake.logs.datadoghq.com/v1/input" />
            <IntegrationRow name="Splunk Enterprise Security" status="Connected" url="https://splunk-hec.corp.internal:8088" />
            <IntegrationRow name="PagerDuty On-Call Alerts" status="Connected" url="https://events.pagerduty.com/v2/enqueue" />
            <IntegrationRow name="Slack #ai-security-alerts" status="Connected" url="https://hooks.slack.com/services/T00/B00/XXXX" />
          </div>
        </div>
      </div>

      {/* KMS & Encryption Keys */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" />
          Cryptographic Key Management (KMS) & HSM Hardware Isolation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase block">KMS Key Identifier</span>
            <span className="text-slate-200 font-bold">kms-agenttrust-prod-v4</span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase block">Rotation Period</span>
            <span className="text-emerald-400 font-bold">30 Days (Next: April 15)</span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase block">HSM Module</span>
            <span className="text-cyan-400 font-bold">FIPS 140-2 Level 3 Hardware</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntegrationRow = ({ name, status, url }: { name: string; status: string; url: string }) => (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
    <div>
      <div className="font-semibold text-white">{name}</div>
      <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{url}</div>
    </div>
    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
      {status}
    </span>
  </div>
);
