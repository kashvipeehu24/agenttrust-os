import React from "react";

const MissionControlCard: React.FC = () => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Mission Control</h3>
      <p className="mt-2 text-sm text-gray-600">
        Monitor AI agents, blockchain transactions, and governance events in
        real time.
      </p>
    </div>
  );
};

export default MissionControlCard;