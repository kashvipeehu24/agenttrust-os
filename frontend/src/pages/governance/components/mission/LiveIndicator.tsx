import React from "react";

const LiveIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 w-fit">
      <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
      <span className="text-sm font-medium text-green-700">
        Live Monitoring Active
      </span>
    </div>
  );
};

export default LiveIndicator;