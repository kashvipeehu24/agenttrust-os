import React from "react";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";

import SecurityStatus from "../components/security/SecurityStatus";
import EmergencyModeCard from "../components/security/EmergencyModeCard";
import FraudTable from "../components/security/FraudTable";
import KillSwitchButton from "../components/security/KillSwitchButton";

import RiskMeter from "../components/analytics/RiskMeter";
import SecurityHealthCard from "../components/analytics/SecurityHealthCard";
import AnalyticsSummary from "../components/analytics/AnalyticsSummary";

import type { SecurityStatus as SecurityStatusType } from "../components/types/security";

const securityStatus: SecurityStatusType = {
  riskLevel: "Green",
  score: 94,
  activeAlerts: 5,
};

const SecurityDashboard: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Security Dashboard"
        subtitle="Monitor fraud detection, security posture and emergency controls."
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Fraud Alerts"
          value={5}
          subtitle="Detected today"
        />

        <StatCard
          title="Blocked Transactions"
          value={12}
          subtitle="Automatically prevented"
        />

        <StatCard
          title="Policy Violations"
          value={3}
          subtitle="Current"
        />

        <StatCard
          title="Security Score"
          value="94%"
          subtitle="Overall health"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RiskMeter
          value={28}
          label="Overall Risk"
        />

        <SecurityHealthCard
          score={94}
        />
      </div>

      <AnalyticsSummary
        fraudRate={2.4}
        alerts={5}
        policyViolations={3}
        securityScore={94}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SecurityStatus status={securityStatus} />
        <EmergencyModeCard />
      </div>

      <FraudTable />

      <div className="flex justify-end">
        <KillSwitchButton />
      </div>
    </div>
  );
};

export default SecurityDashboard;