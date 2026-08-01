import React from "react";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import RiskMeter from "../components/analytics/RiskMeter";
import SecurityHealthCard from "../components/analytics/SecurityHealthCard";
import FraudRateChart from "../components/analytics/FraudRateChart";

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
    </div>
  );
};

export default GovernanceDashboard;