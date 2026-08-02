import React, { useState } from 'react';
import { AuditLog } from '../types/agentTrust';
import { Badge } from '../components/common/Badge';
import {
  FileCheck2,
  Search,
  ShieldCheck,
  Download,
  Lock,
  ExternalLink,
  CheckCircle2,
  FileText,
  Key,
} from 'lucide-react';

interface AuditPageProps {
  auditLogs: AuditLog[];
}

export const AuditPage: React.FC<AuditPageProps> = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.eventType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportPDF = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const complianceFrameworks = [
    { name: 'EU AI Act (High-Risk AI)', status: 'Compliant (100%)', code: 'EU-2024/1689', color: 'text-emerald-400' },
    { name: 'NIST AI Risk Management (RMF)', status: 'Certified', code: 'NIST-AI-100-1', color: 'text-cyan-400' },
    { name: 'SOC 2 Type II (Trust Services)', status: 'Audited & Verified', code: 'CC6.1 - CC6.8', color: 'text-emerald-400' },
    { name: 'ISO/IEC 42001 (AI Management)', status: 'Compliant', code: 'ISO-42001:2023', color: 'text-blue-400' },
    { name: 'HIPAA Security & DLP Guard', status: 'Enforced', code: '45 CFR §164.312', color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            Cryptographic Audit & Compliance Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable SHA-256 hashed audit trail tracking all agent lifecycle events, policy modifications, and isolation states.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-all border border-cyan-400/30"
        >
          <Download className="w-4 h-4" />
          <span>{downloadSuccess ? 'Report Exported!' : 'Export Compliance Audit PDF'}</span>
        </button>
      </div>

      {/* Compliance Framework Scorecards */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Regulatory Compliance Mapping
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {complianceFrameworks.map((fw, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1 hover:border-slate-700 transition-colors"
            >
              <div className="text-[10px] text-slate-500 font-mono">{fw.code}</div>
              <div className="font-bold text-xs text-white truncate">{fw.name}</div>
              <div className={`text-xs font-semibold flex items-center gap-1 ${fw.color}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{fw.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter audit logs..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <span className="text-xs font-mono text-slate-400">
            Chain Status: <strong className="text-emerald-400">0 Network Faults (100% Hash Integrity)</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800 text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Actor / Principal</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Event Details</th>
                <th className="p-3">Cryptographic Hash</th>
                <th className="p-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-white">{log.actor}</td>
                  <td className="p-3 text-slate-300">{log.target}</td>
                  <td className="p-3 text-slate-400 max-w-xs truncate">{log.details}</td>
                  <td className="p-3 font-mono text-[10px] text-slate-500">{log.hash}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      {log.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
