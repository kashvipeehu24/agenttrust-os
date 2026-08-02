import React, { useState } from 'react';
import { mockOrgTrustUnits } from '../mock/mockData';
import { OrgUnitTrust } from '../types/agentTrust';
import { Badge } from '../components/common/Badge';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  FileCheck2,
  Globe,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const OrganizationTrustPage: React.FC = () => {
  const [units, setUnits] = useState<OrgUnitTrust[]>(mockOrgTrustUnits);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Organization Governance & Multi-Tenant Security Hierarchy
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Department-level trust scores, boundary isolation policies, SOC2 Type II, ISO 27001, and EU AI Act compliance ratings.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> SOC2 TYPE II CERTIFIED
          </div>
        </div>
      </div>

      {/* Global Org Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Overall Org Trust Score</span>
          <div className="text-xl font-extrabold text-emerald-400">97.2 / 100</div>
          <span className="text-[10px] text-slate-400">Across 5 Organizational Units</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Total Provisioned Agents</span>
          <div className="text-xl font-extrabold text-cyan-400">18 Autonomous Workers</div>
          <span className="text-[10px] text-slate-400">14 Active, 2 Sandboxed, 2 Quarantined</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold">EU AI Act Risk Posture</span>
          <div className="text-xl font-extrabold text-amber-400">High Risk Class Guarded</div>
          <span className="text-[10px] text-slate-400">Automated Human-in-the-loop Active</span>
        </div>
      </div>

      {/* Department Units Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">{unit.department}</h3>
                <p className="text-xs text-slate-400">{unit.lead}</p>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-500 uppercase block">Trust Rating</span>
                <span className="text-base font-extrabold text-cyan-400">{unit.trustScore}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block">Agents Assigned</span>
                <span className="font-bold text-white">{unit.agentCount} Agents</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block">Inherent Risk Profile</span>
                <div className="mt-1">
                  <Badge type="risk" value={unit.riskProfile} />
                </div>
              </div>
            </div>

            {/* Compliance Badges */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span
                className={`px-2.5 py-1 rounded-lg border ${
                  unit.soc2Compliance === 'Compliant'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                SOC2: {unit.soc2Compliance}
              </span>

              <span
                className={`px-2.5 py-1 rounded-lg border ${
                  unit.iso27001Compliance === 'Compliant'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                ISO27001: {unit.iso27001Compliance}
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                EU AI Act: {unit.euAiActRiskClass}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
