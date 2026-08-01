import React from "react";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";

import AlertCard from "../components/alerts/AlertCard";
import AlertList from "../components/alerts/AlertList";
import ExplainableAlert from "../components/alerts/ExplainableAlert";

import type { Alert } from "../components/types/alert";

const sampleAlert: Alert = {
  id: "ALT-001",
  title: "Suspicious Wallet Activity",
  description:
    "Multiple high-value transactions were detected outside approved governance policies.",
  severity: "High",
  status: "Open",
  timestamp: "2 minutes ago",
};

const FraudAlerts: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Fraud Alerts"
        subtitle="Monitor suspicious transactions, policy violations and security events."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Active Alerts"
          value={5}
          subtitle="Currently Open"
        />

        <StatCard
          title="Critical Alerts"
          value={2}
          subtitle="Immediate Action Required"
        />

        <StatCard
          title="Resolved Today"
          value={14}
          subtitle="Successfully Closed"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AlertCard alert={sampleAlert} />

        <ExplainableAlert alert={sampleAlert} />
      </div>

      <AlertList />
    </div>
  );
};

export default FraudAlerts;