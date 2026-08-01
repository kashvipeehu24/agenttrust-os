import type { Alert } from "../types/alert";

interface Props {
  alert: Alert;
}

const severityStyles = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

const statusStyles = {
  Open: "bg-red-100 text-red-700",
  Resolved: "bg-green-100 text-green-700",
};

export default function AlertCard({ alert }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {alert.title}
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            {alert.description}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            severityStyles[alert.severity]
          }`}
        >
          {alert.severity}
        </span>
      </div>

      <div className="my-4 border-t" />

      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[alert.status]
          }`}
        >
          {alert.status}
        </span>

        <span className="text-xs text-gray-500">
          {alert.timestamp}
        </span>
      </div>
    </div>
  );
}