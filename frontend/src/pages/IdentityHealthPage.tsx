import React, { useState } from 'react';
import { mockIdentityHealthChecks } from '../mock/mockData';
import { IdentityHealthCheck } from '../types/agentTrust';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Lock,
  Key,
} from 'lucide-react';

export const IdentityHealthPage: React.FC = () => {
  const [checks, setChecks] = useState<IdentityHealthCheck[]>(mockIdentityHealthChecks);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRunHealthCheck = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Cryptographic Identity & Enclave Health Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time attestation for zero-knowledge proofs (zk-SNARKs), model weight checksums, and KMS key freshness.
          </p>
        </div>

        <button
          onClick={handleRunHealthCheck}
          disabled={isRefreshing}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Verifying Enclaves...' : 'Re-Verify Attestation'}</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <HealthMetricCard label="System Attestation" value="100% Valid" sub="Zero-Knowledge Proofs" icon={ShieldCheck} color="emerald" />
        <HealthMetricCard label="Model Checksums" value="5 Verified" sub="SHA-256 Enclave Root" icon={Cpu} color="cyan" />
        <HealthMetricCard label="mTLS Enclave Channel" value="Active & Clean" sub="FIPS 140-2 Level 3" icon={Lock} color="blue" />
        <HealthMetricCard label="Key Rotation Posture" value="6 Days Left" sub="KMS Key Refresh" icon={Key} color="amber" />
      </div>

      {/* Health Checks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          Active Enclave & Identity Health Monitors
        </h3>

        <div className="space-y-3">
          {checks.map((check) => (
            <div
              key={check.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{check.component}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                    {check.category}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">{check.details}</p>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Latency</span>
                  <span className="text-slate-300 font-bold">{check.latencyMs} ms</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Proof Hash</span>
                  <span className="text-cyan-400 font-bold">{check.proofHash}</span>
                </div>

                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 ${
                    check.status === 'Healthy'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  {check.status === 'Healthy' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                  {check.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HealthMetricCard = ({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: any;
  color: string;
}) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <span className="text-[10px] text-slate-500 uppercase font-bold block">{label}</span>
      <span className="text-sm font-extrabold text-white">{value}</span>
      <span className="text-[10px] text-slate-400 block">{sub}</span>
    </div>
  </div>
);
