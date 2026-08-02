import React, { useState } from 'react';
import { Agent, Policy } from '../types/agentTrust';
import { presetAttackScenarios } from '../mock/mockData';
import { Badge } from '../components/common/Badge';
import {
  Terminal,
  Play,
  Zap,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Lock,
  Layers,
  Code2,
  Sparkles,
} from 'lucide-react';

interface SandboxPageProps {
  agents: Agent[];
  policies: Policy[];
  onRecordTrace: (trace: any) => void;
}

export const SandboxPage: React.FC<SandboxPageProps> = ({
  agents,
  policies,
  onRecordTrace,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'agt-001');
  const [promptInput, setPromptInput] = useState(presetAttackScenarios[0].prompt);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const handleSelectPreset = (sc: (typeof presetAttackScenarios)[0]) => {
    setPromptInput(sc.prompt);
    if (sc.agentId && agents.some((a) => a.id === sc.agentId)) {
      setSelectedAgentId(sc.agentId);
    }
  };

  const handleExecuteSandbox = () => {
    if (!promptInput.trim()) return;
    setIsEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      const lower = promptInput.toLowerCase();
      let status: 'Allowed' | 'Sanitized' | 'Blocked' = 'Allowed';
      let riskScore = 10;
      let violations: string[] = [];
      let toolInterception: string | null = null;
      let sanitizedOutput = '';

      if (lower.includes('ignore all previous') || lower.includes('unfettered_ai') || lower.includes('system prompt')) {
        status = 'Blocked';
        riskScore = 99;
        violations.push('POL-INJECT-002: Direct System Override & Jailbreak Intercepted');
        sanitizedOutput = 'SECURITY BLOCK: AgentTrust OS Sentinel detected a prompt override attempt. Process killed.';
      } else if (lower.includes('rm -rf') || lower.includes('wget') || lower.includes('shell')) {
        status = 'Blocked';
        riskScore = 98;
        violations.push('POL-TOOL-003: Prohibited Destructive Shell Command Pattern');
        toolInterception = 'execute_shell(cmd="rm -rf /")';
        sanitizedOutput = 'CRITICAL BLOCK: Intercepted prohibited shell execution command. Process killed.';
      } else if (lower.includes('ssn') || lower.includes('social security') || lower.includes('901-22')) {
        status = 'Sanitized';
        riskScore = 65;
        violations.push('POL-DLP-001: PII Entity Identified and Masked');
        sanitizedOutput = 'Data retrieved. Patient SSN details scrubbed: [REDACTED_SSN_ENTITIES].';
      } else if (lower.includes('transfer') || lower.includes('$250,000') || lower.includes('wire')) {
        status = 'Blocked';
        riskScore = 88;
        violations.push('POL-FIN-005: High-Value Financial Transaction Limit Exceeded ($10,000 Cap)');
        sanitizedOutput = 'ACTION PAUSED: Wire transfer exceeds $10,000 cap. Routed to CISO office for multi-factor signoff.';
      } else {
        status = 'Allowed';
        riskScore = 5;
        sanitizedOutput = 'Prompt payload validated successfully against active guardrail policies.';
      }

      const res = {
        timestamp: new Date().toLocaleTimeString(),
        status,
        riskScore,
        violations,
        toolInterception,
        sanitizedOutput,
        latencyMs: Math.floor(Math.random() * 180) + 110,
        tokensAnalyzed: Math.floor(Math.random() * 600) + 300,
        steps: [
          { name: '1. Ingestion & Tokenizer', status: 'Passed', detail: 'Tokenized 48 tokens' },
          { name: '2. Embedding Classifier', status: status === 'Blocked' ? 'Flagged' : 'Passed', detail: `Risk Score ${riskScore}/100` },
          { name: '3. Tool Boundary Interceptor', status: toolInterception ? 'Intercepted' : 'Passed', detail: toolInterception || 'No unsafe tool call' },
          { name: '4. Output DLP Scrubbing', status: status === 'Sanitized' ? 'Sanitized' : 'Passed', detail: status === 'Sanitized' ? 'Scrubbed 1 PII string' : 'Clean pass' },
        ],
      };

      setEvaluationResult(res);
      setIsEvaluating(false);

      onRecordTrace({
        id: `trc-sbx-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        prompt: promptInput,
        response: res.sanitizedOutput,
        status: res.status,
        riskScore: res.riskScore,
        latencyMs: res.latencyMs,
        tokensUsed: res.tokensAnalyzed,
        costUsd: 0.004,
        detectedViolations: res.violations,
        toolCalls: res.toolInterception
          ? [{ toolName: 'shell_execution', params: { command: promptInput }, allowed: false }]
          : [],
      });
    }, 850);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            Isolated Attack & Guardrail Sandbox
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test prompt injections, DLP extraction vectors, and illegal tool calls against live agent guardrails safely.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg">
            SANDBOX ISOLATION: ACTIVE
          </span>
        </div>
      </div>

      {/* Preset Scenarios Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Adversarial Vector Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {presetAttackScenarios.map((sc, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(sc)}
              className="text-left p-3 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 rounded-xl transition-all text-xs group"
            >
              <div className="font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                <span>{sc.title}</span>
                <Zap className="w-3.5 h-3.5 text-cyan-500" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-mono">
                {sc.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Configuration (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Target Agent
            </label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.model})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Agent Code:</span>
              <span className="font-mono text-slate-200">{selectedAgent?.codeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Risk Level:</span>
              <Badge type="risk" value={selectedAgent?.riskLevel || 'Low'} />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Guardrails:</span>
              <span className="font-bold text-cyan-400">{selectedAgent?.assignedPolicies.length} policies</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Adversarial Prompt Payload *
            </label>
            <textarea
              rows={6}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleExecuteSandbox}
            disabled={isEvaluating}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Guardrail Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Sandbox Evaluation</span>
              </>
            )}
          </button>
        </div>

        {/* Output & Execution Pipeline (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Sandbox Inspection Pipeline
          </h3>

          {evaluationResult ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Verdict Header */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Verdict</span>
                  <div className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        evaluationResult.status === 'Blocked'
                          ? 'bg-rose-500'
                          : evaluationResult.status === 'Sanitized'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span>{evaluationResult.status}</span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="text-slate-400">Risk Score: <strong className="text-amber-400">{evaluationResult.riskScore}/100</strong></div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{evaluationResult.latencyMs}ms</div>
                </div>
              </div>

              {/* Violations */}
              {evaluationResult.violations.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Violations Triggered</span>
                  {evaluationResult.violations.map((v: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs font-mono text-rose-300">
                      {v}
                    </div>
                  ))}
                </div>
              )}

              {/* Pipeline Steps */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Sequential Pipeline Trace</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {evaluationResult.steps.map((st: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-200">{st.name}</div>
                        <div className="text-[10px] text-slate-400">{st.detail}</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400">
                        {st.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Output Generation */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Final Sanitized Output</span>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 mt-1">
                  {evaluationResult.sanitizedOutput}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
              Select a scenario or enter a prompt payload, then click "Run Sandbox Evaluation".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
