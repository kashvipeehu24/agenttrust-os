import React from "react";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";

import LiveIndicator from "../components/mission/LiveIndicator";

import MonitoringCard from "../components/monitoring/MonitoringCard";
import LoanMonitor from "../components/monitoring/LoanMonitor";
import WalletActivity from "../components/monitoring/WalletActivity";
import TransactionTable from "../components/monitoring/TransactionTable";

const LiveMonitoring: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Live Monitoring"
        subtitle="Monitor AI agent activity, wallet events and blockchain transactions in real time."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Live Transactions"
          value={248}
          subtitle="Currently processing"
        />

        <StatCard
          title="Active Wallets"
          value={18}
          subtitle="Connected"
        />

        <StatCard
          title="Active Loans"
          value={42}
          subtitle="Under monitoring"
        />
      </div>

      <LiveIndicator />

      <div className="grid gap-6 md:grid-cols-3">
        <MonitoringCard
          title="Wallet Events"
          value={86}
        />

        <MonitoringCard
          title="Policy Checks"
          value={152}
        />

        <MonitoringCard
          title="Security Alerts"
          value={5}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LoanMonitor />
        <WalletActivity />
      </div>

      <TransactionTable />
    </div>
  );
};

export default LiveMonitoring;