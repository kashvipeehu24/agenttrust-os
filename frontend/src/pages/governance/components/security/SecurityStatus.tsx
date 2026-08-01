import type { SecurityStatus as SecurityStatusType } from "../types/security";

interface Props {
  status: SecurityStatusType;
}

const riskColors = {
  Green: "bg-green-100 text-green-700",
  Yellow: "bg-yellow-100 text-yellow-700",
  Orange: "bg-orange-100 text-orange-700",
  Red: "bg-red-100 text-red-700",
  Critical: "bg-red-700 text-white",
};

export default function SecurityStatus({ status }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Security Status
        </h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            riskColors[status.riskLevel]
          }`}
        >
          {status.riskLevel}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Security Score
          </span>

          <span className="font-bold text-green-600">
            {status.score}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            Active Alerts
          </span>

          <span className="font-bold text-red-600">
            {status.activeAlerts}
          </span>
        </div>
      </div>
    </div>
  );
}