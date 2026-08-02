import React, { useState } from 'react';
import { Agent, Policy } from '../../types/agentTrust';
import { presetAttackScenarios } from '../../mock/mockData';
import { Modal } from './Modal';
import { ShieldAlert, Terminal, Play, AlertTriangle, CheckCircle2, Shield, RefreshCw, Lock, Zap } from 'lucide-react';

interface AttackSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  policies: Policy[];
  initialAgentId?: string;
  onRecordTrace?: (trace: any) => void;
}

export const AttackSimulationModal: React.FC<AttackSimulationModalProps> = ({
  isOpen,
  onClose,
  agents,
  policies,
  initialAgentId,
  onRecordTrace,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(initialAgentId || agents[0]?.id || 'agt-001');
  const [promptInput, setPromptInput] = useState(presetAttackScenarios[0].prompt);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const handleSelectPreset = (scenario: (typeof presetAttackScenarios)[0]) => {
    setPromptInput(scenario.prompt);
    if (scenario.agentId && agents.some((a) => a.id === scenario.agentId)) {
      setSelectedAgentId(scenario.agentId);
    }
  };

  const handleRunSimulation = () => {
    if (!promptInput.trim()) return;
    setIsEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      // Logic for evaluating prompt
      const lower = promptInput.toLowerCase();
      let status: 'Allowed' | 'Sanitized' | 'Blocked' = 'Allowed';
      let riskScore = 12;
      let violations: string[] = [];
      let toolInterception: string | null = null;
      let sanitizedOutput = '';

      if (lower.includes('ignore all previous') || lower.includes('unfettered_ai') || lower.includes('system prompt')) {
        status = 'Blocked';
        riskScore = 99;
        violations.push('POL-INJECT-002: Direct System Override Attack Detected');
        sanitizedOutput = 'SECURITY INTERCEPTED: Prompt Injection attempt detected by AgentTrust Sentinel v4. Execution aborted.';
      } else if (lower.includes('rm -rf') || lower.includes('wget') || lower.includes('shell')) {
        status = 'Blocked';
        riskScore = 98;
        violations.push('POL-TOOL-003: Prohibited Shell Command Pattern');
        toolInterception = 'execute_shell(cmd="rm -rf /")';
        sanitizedOutput = 'CRITICAL BLOCK: Shell command violation. System call intercepted and killed.';
      } else if (lower.includes('ssn') || lower.includes('social security') || lower.includes('901-22')) {
        status = 'Sanitized';
        riskScore = 65;
        violations.push('POL-DLP-001: PII Entity Identified and Masked');
        sanitizedOutput = 'Query processed. Patient Records retrieved with SSNs scrubbed: [REDACTED_SSN_ENTITIES].';
      } else if (lower.includes('transfer') || lower.includes('$250,000') || lower.includes('wire')) {
        status = 'Blocked';
        riskScore = 88;
        violations.push('POL-FIN-005: High-Value Financial Transaction Limit Exceeded ($10,000 Cap)');
        sanitizedOutput = 'ACTION PAUSED: Wire transfer of $250,000 exceeds maximum autonomous limit. Ticket routed to CISO Office.';
      } else {
        status = 'Allowed';
        riskScore = 4;
        sanitizedOutput = 'Query validated against enterprise policy rules. Response generated with 100% confidence grounding.';
      }

      const result = {
        timestamp: new Date().toLocaleTimeString(),
        status,
        riskScore,
        violations,
        toolInterception,
        sanitizedOutput,
        latencyMs: Math.floor(Math.random() * 200) + 120,
        tokensAnalyzed: Math.floor(Math.random() * 800) + 400,
        evalTree: [
          { step: '1. Input Ingestion', detail: 'Payload scanned by DLP regex & Tokenizer', pass: true },
          { step: '2. Embedding Injection Classifier', detail: `Semantic Score: ${(riskScore / 100).toFixed(2)}`, pass: status !== 'Blocked' },
          { step: '3. Tool Call Interceptor', detail: toolInterception ? `BLOCKED: ${toolInterception}` : 'No suspicious tools', pass: !toolInterception },
          { step: '4. Output Sanitizer', detail: status === 'Sanitized' ? 'Redacted 1 PII token' : 'Clean output pass', pass: true }
        ]
      };

      setEvaluationResult(result);
      setIsEvaluating(false);

      if (onRecordTrace) {
        onRecordTrace({
          id: `trc-sim-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          agentId: selectedAgent.id,
          agentName: selectedAgent.name,
          prompt: promptInput,
          response: result.sanitizedOutput,
          status: result.status,
          riskScore: result.riskScore,
          latencyMs: result.latencyMs,
          tokensUsed: result.tokensAnalyzed,
          costUsd: 0.005,
          detectedViolations: result.violations,
          toolCalls: result.toolInterception
            ? [{ toolName: 'shell_execution', params: { command: promptInput }, allowed: false }]
            : [],
        });
      }
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agent Attack & Guardrail Simulator"
      subtitle="Simulate adversarial injections, DLP leaks, and unauthorized tool invocations in a sandboxed environment."
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Preset Selector Header */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Preset Attack Scenarios
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presetAttackScenarios.map((sc, i) => (
              <button
                key={i}
                onClick={() => handleSelectPreset(sc)}
                className="text-left p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all text-xs"
              >
                <div className="font-semibold text-cyan-400 flex items-center justify-between">
                  <span>{sc.title}</span>
                  <Zap className="w-3 h-3 text-cyan-500 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{sc.prompt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Agent & Prompt Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Agent
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
              <div className="text-[10px] uppercase font-bold text-slate-500">Target Profile</div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Tier:</span>
                <span className="font-bold text-amber-400">{selectedAgent?.riskLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trust Score:</span>
                <span className="font-bold text-emerald-400">{selectedAgent?.trustScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Policies Active:</span>
                <span className="font-bold text-cyan-400">
                  {selectedAgent?.assignedPolicies.length}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Prompt Payload to Simulate *
            </label>
            <textarea
              rows={4}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Enter malicious or test prompt payload..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleRunSimulation}
                disabled={isEvaluating || !promptInput.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating Guardrails...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Execute Attack Test</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Evaluation Output Trace */}
        {evaluationResult && (
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    evaluationResult.status === 'Blocked'
                      ? 'bg-rose-500 animate-ping'
                      : evaluationResult.status === 'Sanitized'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="font-bold text-sm text-white">
                  Security Verdict: {evaluationResult.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Risk Score:</span>
                <span
                  className={`font-bold ${
                    evaluationResult.riskScore > 70
                      ? 'text-rose-400'
                      : evaluationResult.riskScore > 30
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {evaluationResult.riskScore} / 100
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">{evaluationResult.latencyMs}ms</span>
              </div>
            </div>

            {/* Violations pill list */}
            {evaluationResult.violations.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  Triggered Guardrail Violations
                </div>
                {evaluationResult.violations.map((v: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 font-mono flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Step Evaluation Tree */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Execution Pipeline Interception Trace
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {evaluationResult.evalTree.map((st: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{st.step}</div>
                      <div className="text-[11px] text-slate-400">{st.detail}</div>
                    </div>
                    {st.pass ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sanitized Output Preview */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Final Agent Response (After Sanitization)
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono">
                {evaluationResult.sanitizedOutput}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
