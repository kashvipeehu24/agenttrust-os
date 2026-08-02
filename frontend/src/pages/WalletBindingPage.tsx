import React, { useState } from 'react';
import { mockWalletBindings } from '../mock/mockData';
import { WalletBinding } from '../types/agentTrust';
import {
  Wallet,
  ShieldCheck,
  Lock,
  DollarSign,
  AlertOctagon,
  Copy,
  CheckCircle2,
  Users,
  Coins,
} from 'lucide-react';

export const WalletBindingPage: React.FC = () => {
  const [bindings, setBindings] = useState<WalletBinding[]>(mockWalletBindings);
  const [selectedWallet, setSelectedWallet] = useState<WalletBinding>(bindings[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFreezeWallet = (agentId: string) => {
    setBindings((prev) =>
      prev.map((w) =>
        w.agentId === agentId
          ? {
              ...w,
              status: w.status === 'Frozen' ? 'Active & Bound' : 'Frozen',
            }
          : w
      )
    );
    if (selectedWallet.agentId === agentId) {
      setSelectedWallet((prev) => ({
        ...prev,
        status: prev.status === 'Frozen' ? 'Active & Bound' : 'Frozen',
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-cyan-400" />
            Agent Wallet Binding & Financial Allowance Controls
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gnosis Multi-Sig smart-contract bindings, daily USD spend allowances, and circuit breakers for payment agents.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-xl">
            24H TOTAL AGENT SPEND: $15,650.00 USD
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wallet List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 px-2">
            Bound Agent Wallets
          </h3>

          <div className="space-y-2">
            {bindings.map((w) => (
              <div
                key={w.agentId}
                onClick={() => setSelectedWallet(w)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedWallet.agentId === w.agentId
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">{w.agentName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      w.status === 'Active & Bound'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border-rose-800'
                    }`}
                  >
                    {w.status}
                  </span>
                </div>

                <p className="font-mono text-[10px] text-slate-400 truncate">{w.walletAddress}</p>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-900 text-[10px] text-slate-400 font-mono">
                  <span>24h Spent: <strong className="text-white">${w.spent24hUsd.toLocaleString()}</strong></span>
                  <span>Daily Cap: <strong className="text-cyan-400">${w.dailyAllowanceCapUsd.toLocaleString()}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Wallet Details (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">{selectedWallet.agentName}</h2>
              <p className="text-xs text-cyan-400 font-mono">{selectedWallet.network}</p>
            </div>

            <button
              onClick={() => toggleFreezeWallet(selectedWallet.agentId)}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                selectedWallet.status === 'Frozen'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              {selectedWallet.status === 'Frozen' ? 'Unfreeze Wallet' : 'Emergency Freeze Wallet'}
            </button>
          </div>

          {/* Address & Multi-Sig Requirements */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-slate-500 font-bold">On-Chain Multi-Sig Address</span>
              <button
                onClick={() => handleCopy(selectedWallet.walletAddress)}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-cyan-300 font-bold break-all">{selectedWallet.walletAddress}</p>

            <div className="pt-2 border-t border-slate-900 text-slate-400">
              <span className="text-[10px] uppercase text-slate-500 block">Multi-Sig Approval Threshold</span>
              <span className="text-white font-semibold">{selectedWallet.multiSigRequirement}</span>
            </div>
          </div>

          {/* Allowance Cap Progress */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-300 font-mono">
              <span>Daily Allowance Utilization</span>
              <span>
                ${selectedWallet.spent24hUsd.toLocaleString()} / ${selectedWallet.dailyAllowanceCapUsd.toLocaleString()} USD
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (selectedWallet.spent24hUsd / selectedWallet.dailyAllowanceCapUsd) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Approved Tokens & Signers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-cyan-400" /> Approved Token Balances
              </span>
              <div className="space-y-1 font-mono">
                {selectedWallet.approvedTokens.map((t) => (
                  <div key={t.symbol} className="flex justify-between text-slate-300">
                    <span>{t.symbol}</span>
                    <span className="font-bold text-white">{t.balance}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Authorized Multi-Sig Keyholders
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {selectedWallet.authorizedSigners.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
