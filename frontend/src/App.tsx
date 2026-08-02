import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { SandboxPage } from './pages/SandboxPage';
import { AuditPage } from './pages/AuditPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterAgentPage } from './pages/RegisterAgentPage';
import { AgentPassportPage } from './pages/AgentPassportPage';
import { ReputationTimelinePage } from './pages/ReputationTimelinePage';
import { IdentityHealthPage } from './pages/IdentityHealthPage';
import { WalletBindingPage } from './pages/WalletBindingPage';
import { OrganizationTrustPage } from './pages/OrganizationTrustPage';
import { AgentSkillProfilePage } from './pages/AgentSkillProfilePage';
import { AttackSimulationModal } from './components/common/AttackSimulationModal';

// Underwriting Module Pages
import UnderwritingDashboard from './pages/underwriting/UnderwritingDashboard';
import LoanApplicationPage from './pages/underwriting/LoanApplicationPages';

// Repayment Monitoring Module Pages
import RepaymentModule from './pages/repayment/RepaymentModule';
import WalletDashboard from './pages/repayment/pages/WalletDashboard';
import TransactionsPage from './pages/repayment/pages/TransactionsPage';
import RepaymentDashboard from './pages/repayment/pages/RepaymentDashboard';
import RevenueDashboard from './pages/repayment/pages/RevenueDashboard';
import CashFlowDashboard from './pages/repayment/pages/CashFlowDashboard';
import ForecastDashboard from './pages/repayment/pages/ForecastDashboard';
import AISuggestionDashboard from './pages/repayment/pages/AISuggestionDashboard';

// Governance Module Pages
import GovernanceDashboard from './pages/governance/pages/GovernanceDashboard';
import SecurityDashboard from './pages/governance/pages/SecurityDashboard';
import MissionControl from './pages/governance/pages/MissionControl';
import LiveMonitoring from './pages/governance/pages/LiveMonitoring';
import FraudAlerts from './pages/governance/pages/FraudAlerts';

import {
  initialAgents,
  initialPolicies,
  initialSystemMetrics,
  initialTraceLogs,
  initialIncidents,
  initialAuditLogs,
} from './mock/mockData';
import { Agent, Policy, ExecutionTrace, Incident, AuditLog } from './types/agentTrust';

export function App() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [metrics, setMetrics] = useState(initialSystemMetrics);
  const [traces, setTraces] = useState<ExecutionTrace[]>(initialTraceLogs);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Attack simulator modal state
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);
  const [simulatorTargetAgentId, setSimulatorTargetAgentId] = useState<string | undefined>();

  // Handlers
  const handleStatusChange = (agentId: string, newStatus: Agent['status']) => {
    setAgents((prev) =>
      prev.map((ag) => (ag.id === agentId ? { ...ag, status: newStatus } : ag))
    );

    // Record audit log
    const targetAgent = agents.find((a) => a.id === agentId);
    const newAudit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      eventType: newStatus === 'Quarantined' ? 'Agent Quarantined' : 'System Setting Updated',
      actor: 'Security Operations (Vikram Patel)',
      target: `${targetAgent?.name || 'Agent'} (${agentId})`,
      details: `Changed status to ${newStatus}`,
      hash: `0x${Math.random().toString(16).slice(2, 10)}`,
      verificationStatus: 'Verified',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleAddAgent = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalAgents: prev.totalAgents + 1,
      activeAgents: prev.activeAgents + 1,
    }));
  };

  const handleTogglePolicy = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((pol) => (pol.id === policyId ? { ...pol, enabled: !pol.enabled } : pol))
    );
  };

  const handleChangePolicyMode = (policyId: string, mode: Policy['enforcementMode']) => {
    setPolicies((prev) =>
      prev.map((pol) => (pol.id === policyId ? { ...pol, enforcementMode: mode } : pol))
    );
  };

  const handleAddPolicy = (newPolicy: Policy) => {
    setPolicies((prev) => [newPolicy, ...prev]);
  };

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'Resolved' } : inc))
    );
  };

  const handleRecordTrace = (newTrace: ExecutionTrace) => {
    setTraces((prev) => [newTrace, ...prev]);
    if (newTrace.status === 'Blocked') {
      setMetrics((prev) => ({
        ...prev,
        blockedInvocations24h: prev.blockedInvocations24h + 1,
        policyViolations24h: prev.policyViolations24h + 1,
      }));
    }
  };

  const handleOpenSandboxForAgent = (agent: Agent) => {
    setSimulatorTargetAgentId(agent.id);
    setIsSandboxModalOpen(true);
  };

  return (
    <Router>
      <Routes>
        {/* Fullscreen Standalone Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated Layout Wrapped Routes */}
        <Route
          path="/*"
          element={
            <Layout
              onOpenSandbox={() => {
                setSimulatorTargetAgentId(undefined);
                setIsSandboxModalOpen(true);
              }}
              openIncidentsCount={incidents.filter((i) => i.status !== 'Resolved').length}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <DashboardPage
                      metrics={metrics}
                      agents={agents}
                      incidents={incidents}
                      traces={traces}
                      onOpenSandbox={() => {
                        setSimulatorTargetAgentId(undefined);
                        setIsSandboxModalOpen(true);
                      }}
                      onSelectAgent={handleOpenSandboxForAgent}
                    />
                  }
                />
                <Route
                  path="/register-agent"
                  element={<RegisterAgentPage policies={policies} onAddAgent={handleAddAgent} />}
                />
                <Route
                  path="/agents"
                  element={
                    <AgentsPage
                      agents={agents}
                      policies={policies}
                      onStatusChange={handleStatusChange}
                      onAddAgent={handleAddAgent}
                      onSimulate={handleOpenSandboxForAgent}
                    />
                  }
                />
                <Route path="/passport" element={<AgentPassportPage agents={agents} />} />
                <Route path="/passport/:id" element={<AgentPassportPage agents={agents} />} />
                <Route path="/reputation-timeline" element={<ReputationTimelinePage />} />
                <Route path="/identity-health" element={<IdentityHealthPage />} />
                <Route path="/wallet-binding" element={<WalletBindingPage />} />
                <Route path="/organization-trust" element={<OrganizationTrustPage />} />
                <Route path="/skills-profile" element={<AgentSkillProfilePage />} />
                <Route path="/monitoring" element={<MonitoringPage traces={traces} />} />
                <Route
                  path="/policies"
                  element={
                    <PoliciesPage
                      policies={policies}
                      onTogglePolicy={handleTogglePolicy}
                      onChangeMode={handleChangePolicyMode}
                      onAddPolicy={handleAddPolicy}
                    />
                  }
                />
                <Route
                  path="/sandbox"
                  element={
                    <SandboxPage
                      agents={agents}
                      policies={policies}
                      onRecordTrace={handleRecordTrace}
                    />
                  }
                />
                <Route path="/audit" element={<AuditPage auditLogs={auditLogs} />} />
                <Route
                  path="/incidents"
                  element={
                    <IncidentsPage
                      incidents={incidents}
                      onResolveIncident={handleResolveIncident}
                      onQuarantineAgent={(agtId) => handleStatusChange(agtId, 'Quarantined')}
                    />
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Underwriting Module */}
                <Route path="/underwriting" element={<UnderwritingDashboard />} />
                <Route path="/underwriting/loan-application" element={<LoanApplicationPage />} />

                {/* Repayment Module */}
                <Route path="/repayment/dashboard" element={<RepaymentDashboard />} />
                <Route path="/repayment/wallet" element={<WalletDashboard />} />
                <Route path="/repayment/cashflow" element={<CashFlowDashboard />} />
                <Route path="/repayment/forecast" element={<ForecastDashboard />} />
                <Route path="/repayment/transactions" element={<TransactionsPage />} />
                <Route path="/repayment/revenue" element={<RevenueDashboard />} />
                <Route path="/repayment/suggestions" element={<AISuggestionDashboard />} />
                <Route path="/repayment/module" element={<RepaymentModule />} />

                {/* Governance Module */}
                <Route path="/governance" element={<GovernanceDashboard />} />
                <Route path="/governance/security" element={<SecurityDashboard />} />
                <Route path="/governance/mission-control" element={<MissionControl />} />
                <Route path="/governance/live-monitoring" element={<LiveMonitoring />} />
                <Route path="/governance/fraud-alerts" element={<FraudAlerts />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>

      {/* Global Quick Attack Simulator Modal */}
      <AttackSimulationModal
        isOpen={isSandboxModalOpen}
        onClose={() => setIsSandboxModalOpen(false)}
        agents={agents}
        policies={policies}
        initialAgentId={simulatorTargetAgentId}
        onRecordTrace={handleRecordTrace}
      />
    </Router>
  );
}

export default App;
