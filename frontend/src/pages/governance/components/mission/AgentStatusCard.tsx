import React from "react";

const AgentStatusCard: React.FC = () => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Agent Status</h3>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Loan Agent</span>
          <span className="text-green-600 font-medium">Active</span>
        </div>

        <div className="flex justify-between">
          <span>Risk Agent</span>
          <span className="text-green-600 font-medium">Healthy</span>
        </div>

        <div className="flex justify-between">
          <span>Fraud Agent</span>
          <span className="text-yellow-600 font-medium">Monitoring</span>
        </div>
      </div>
    </div>
  );
};

export default AgentStatusCard;