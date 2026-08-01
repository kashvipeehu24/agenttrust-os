import type { Alert } from "../types/alert";

interface Props {
  alert: Alert;
}

export default function AlertCard({ alert }: Props) {
  return (
    <div className="rounded-xl border border-red-200 bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{alert.title}</h3>

        <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
          {alert.severity}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        {alert.description}
      </p>

      <p className="mt-3 text-xs text-gray-400">
        {alert.timestamp}
      </p>
    </div>
  );
}