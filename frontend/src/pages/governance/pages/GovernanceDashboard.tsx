import React from "react";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";

import RiskMeter from "../components/analytics/RiskMeter";
import SecurityHealthCard from "../components/analytics/SecurityHealthCard";
import FraudRateChart from "../components/analytics/FraudRateChart";
import AnalyticsSummary from "../components/analytics/AnalyticsSummary";

import PolicyCard from "../components/governance/PolicyCard";
import PolicyStatus from "../components/governance/PolicyStatus";
import RestrictionBadge from "../components/governance/RestrictionBadge";

import type { Policy } from "../components/types/policy";

const samplePolicy: Policy = {
  id: "POL-001",
  name: "Daily Spending Policy",
  enabled: true,
  description:
    "Restricts AI agent spending to approved vendors within configured daily limits.",
};

const GovernanceDashboard: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Governance Dashboard"
        subtitle="Monitor AI governance, security health and fraud trends."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Active Policies"
          value={18}
          subtitle="Currently enforced"
        />

        <StatCard
          title="Fraud Alerts"
          value={5}
          subtitle="Detected today"
        />

        <StatCard
          title="Verified Agents"
          value={42}
          subtitle="Running securely"
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

      <FraudRateChart
        labels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
        data={[2, 5, 1, 6, 3]}
      />

      <AnalyticsSummary
        fraudRate={2.4}
        alerts={5}
        policyViolations={3}
        securityScore={94}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PolicyCard policy={samplePolicy} />

        <div className="space-y-4 rounded-xl border bg-white p-6 shadow">
          <h3 className="text-lg font-semibold">Policy Status</h3>

          <PolicyStatus enabled={samplePolicy.enabled} />

          <RestrictionBadge label="Daily Spending Limit" />
        </div>
      </div>
    </div>
  );
};

export default GovernanceDashboard;