import AlertCard from "./AlertCard";
import { useAlerts } from "../hooks/useAlerts";

export default function AlertList() {
  const { alerts } = useAlerts();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Alerts
        </h2>

        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
          {alerts.length} Active
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">
            No active alerts detected.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
            />
          ))}
        </div>
      )}
    </section>
  );
}