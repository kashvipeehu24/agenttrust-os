import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Agent } from '../types/agentTrust';
import { mockPassports } from '../mock/mockData';
import { Badge } from '../components/common/Badge';
import {
  FileCheck2,
  Shield,
  Cpu,
  Lock,
  CheckCircle2,
  QrCode,
  Copy,
  ExternalLink,
  Bot,
  Key,
} from 'lucide-react';

interface AgentPassportPageProps {
  agents: Agent[];
}

export const AgentPassportPage: React.FC<AgentPassportPageProps> = ({ agents }) => {
  const { id } = useParams<{ id?: string }>();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(id || agents[0]?.id || 'agt-001');
  const [copied, setCopied] = useState(false);

  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const passport =
    mockPassports.find((p) => p.agentId === currentAgent?.id) || {
      agentId: currentAgent?.id || 'agt-001',
      agentName: currentAgent?.name || 'FinBot Executive',
      certificateId: `CERT-PASSPORT-2025-${currentAgent?.id || '001'}`,
      issuedAt: '2025-01-15 08:00:00 UTC',
      expiresAt: '2026-01-15 08:00:00 UTC',
      issuer: 'AgentTrust Global Certificate Authority (CA-ROOT-01)',
      hardwareEnclave: 'AWS Nitro Enclaves (FIPS 140-2 Level 3)',
      signatureAlgorithm: 'ECDSA-SHA256 with Ed25519 Hardware Attestation',
      publicFingerprint: '8f:9a:3c:11:4d:22:90:e8:1b:7a:5e:3f:01:92:4b:6c',
      merkleRootHash: '0x3f8a109e24b75c8d1902a49f810e32b4901f2384c7',
      attestationStatus: 'Verified' as const,
      trustSealLevel: 'Platinum Tier' as const,
    };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            Cryptographic Agent Passport & Attestation Certificate
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verifiable agent identity bound to hardware enclave roots, model hashes, and owner attestation signatures.
          </p>
        </div>

        {/* Agent Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Agent:</span>
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 font-semibold"
          >
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name} ({ag.codeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Passport Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Passport Badge (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Seal */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-white block tracking-wide uppercase">
                  AgentTrust Passport
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold block">
                  {passport.trustSealLevel}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </span>
          </div>

          {/* Agent Avatar / ID details */}
          <div className="space-y-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-cyan-500/60 mx-auto flex items-center justify-center text-cyan-400 text-2xl font-bold shadow-lg shadow-cyan-950">
              <Bot className="w-8 h-8 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-white">{currentAgent?.name}</h2>
              <p className="text-xs font-mono text-cyan-400">{currentAgent?.codeName}</p>
            </div>

            <div className="inline-block px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-mono text-slate-400">
              ID: {currentAgent?.id}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Trust Score</span>
              <span className="text-base font-extrabold text-emerald-400">{currentAgent?.trustScore}%</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Risk Level</span>
              <div className="mt-1 flex justify-center">
                <Badge type="risk" value={currentAgent?.riskLevel || 'Medium'} />
              </div>
            </div>
          </div>

          {/* QR Code / Fingerprint */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center gap-4 text-xs font-mono">
            <div className="w-12 h-12 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-slate-950" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Public Fingerprint</span>
              <p className="text-[10px] text-slate-300 truncate">{passport.publicFingerprint}</p>
            </div>
          </div>
        </div>

        {/* Passport Technical Details & Claims (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="font-bold text-sm text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              Cryptographic Identity Claims & Attestation Record
            </span>
            <span className="text-[10px] font-mono text-slate-500">{passport.certificateId}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <ClaimBox label="Certificate Issuer" value={passport.issuer} icon={Shield} />
            <ClaimBox label="Hardware Enclave Root" value={passport.hardwareEnclave} icon={Cpu} />
            <ClaimBox label="Issuance Timestamp" value={passport.issuedAt} icon={CheckCircle2} />
            <ClaimBox label="Expiration Date" value={passport.expiresAt} icon={CheckCircle2} />
            <ClaimBox label="Signature Scheme" value={passport.signatureAlgorithm} icon={Key} />
            <ClaimBox label="Agent Owner Attestation" value={currentAgent?.owner || 'Elena Rostova'} icon={Bot} />
          </div>

          {/* Merkle Root Hash Proof */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-slate-500 font-bold">Merkle State Root Hash</span>
              <button
                onClick={() => handleCopyHash(passport.merkleRootHash)}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy Hash'}
              </button>
            </div>
            <p className="text-emerald-400 font-bold truncate">{passport.merkleRootHash}</p>
          </div>

          {/* Assigned Model Weights & Engine */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
            <span className="text-[10px] uppercase text-slate-500 font-bold block font-mono">
              Attested Model Engine & Execution Scope
            </span>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg font-mono font-bold">
                {currentAgent?.model}
              </span>
              <span className="px-2.5 py-1 bg-slate-900 text-slate-300 border border-slate-800 rounded-lg font-mono">
                Version: {currentAgent?.version}
              </span>
              <span className="px-2.5 py-1 bg-slate-900 text-slate-300 border border-slate-800 rounded-lg font-mono">
                Dept: {currentAgent?.department}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClaimBox = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
    <div className="text-[10px] uppercase text-slate-500 font-bold font-mono flex items-center gap-1.5">
      <Icon className="w-3 h-3 text-cyan-400" />
      <span>{label}</span>
    </div>
    <div className="text-xs text-slate-200 font-semibold">{value}</div>
  </div>
);
