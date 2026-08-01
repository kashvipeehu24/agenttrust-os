import React from "react";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";

import MissionControlCard from "../components/mission/MissionControlCard";
import AgentStatusCard from "../components/mission/AgentStatusCard";
import WalletStatusCard from "../components/mission/WalletStatusCard";
import LiveIndicator from "../components/mission/LiveIndicator";

import LoanMonitor from "../components/monitoring/LoanMonitor";
import MonitoringCard from "../components/monitoring/MonitoringCard";

import RiskMeter from "../components/analytics/RiskMeter";
import SecurityHealthCard from "../components/analytics/SecurityHealthCard";

import KillSwitchButton from "../components/security/KillSwitchButton";

const MissionControl: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Mission Control"
        subtitle="Centralized monitoring of AI agents and blockchain activity."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Active Agents"
          value={42}
          subtitle="Currently online"
        />

        <StatCard
          title="Connected Wallets"
          value={18}
          subtitle="Verified"
        />

        <StatCard
          title="Running Missions"
          value={7}
          subtitle="In progress"
        />
      </div>

      <LiveIndicator />

      <div className="grid gap-6 lg:grid-cols-2">
        <MissionControlCard />
        <AgentStatusCard />
      </div>

      <WalletStatusCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <LoanMonitor />
        <RiskMeter
          value={28}
          label="Overall Risk"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MonitoringCard
          title="Live Transactions"
          value={28}
        />

        <MonitoringCard
          title="Wallet Activity"
          value="18 Active"
        />
      </div>

      <SecurityHealthCard score={94} />
      <KillSwitchButton />
    </div>
  );
};

export default MissionControl;