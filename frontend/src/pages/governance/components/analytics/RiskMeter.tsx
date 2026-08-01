import React from "react";

interface RiskMeterProps {
  value: number;
  max?: number;
  label?: string;
}

const RiskMeter: React.FC<RiskMeterProps> = ({
  value,
  max = 100,
  label = "Risk Score",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const color =
    percentage < 40
      ? "bg-green-500"
      : percentage < 70
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {label}
        </h3>

        <span className="text-sm font-medium text-slate-600">
          {value}/{max}
        </span>
      </div>

      <div className="h-4 w-full rounded-full bg-gray-200">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-slate-500">
        Current Risk Level: {percentage.toFixed(0)}%
      </p>
    </div>
  );
};

export default RiskMeter;