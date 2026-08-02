import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  KeyRound,
  UserCheck,
  Lock,
  Building2,
  ArrowRight,
  CheckCircle2,
  Fingerprint,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'CISO' | 'SecOps' | 'AgentDeveloper'>('CISO');
  const [email, setEmail] = useState('vikram.patel@corp.com');
  const [password, setPassword] = useState('••••••••••••');
  const [apiKey, setApiKey] = useState('at_live_sec_99182348a10b99c2');
  const [loginMethod, setLoginMethod] = useState<'sso' | 'apiKey'>('sso');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-950/80 border border-cyan-400/30 mb-2">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AgentTrust <span className="text-cyan-400 font-mono">OS</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise Autonomous AI Guardrails & Cryptographic Governance
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          {/* Tabs: SSO vs API Key */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLoginMethod('sso')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                loginMethod === 'sso'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Enterprise SSO</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('apiKey')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                loginMethod === 'apiKey'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin Token</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {loginMethod === 'sso' ? (
              <>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>

                {/* Role Switcher Demo */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Select Security Role Profile</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'CISO', label: 'CISO / Lead' },
                      { id: 'SecOps', label: 'SecOps Analyst' },
                      { id: 'AgentDeveloper', label: 'Agent Ops' },
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id as any)}
                        className={`p-2 text-[11px] rounded-xl border text-center font-semibold transition-all ${
                          selectedRole === role.id
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-slate-400 mb-1 font-medium">API Token Key Hash</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Encrypted bearer key issued by KMS Hardware Module
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <span>Authenticating Enclave Session...</span>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>Access AgentTrust Control Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Security Badge Footer */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> FIPS 140-2 Level 3
            </span>
            <span>Zero-Trust KMS Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};
