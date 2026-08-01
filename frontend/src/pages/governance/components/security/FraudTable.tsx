import { useAlerts } from "../hooks/useAlerts";

const severityColors = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

export default function FraudTable() {
  const { alerts } = useAlerts();

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">
          Fraud Detection Events
        </h2>

        <p className="text-sm text-gray-500">
          Live monitoring of suspicious transactions and policy violations.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Alert
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Severity
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Status
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Time
              </th>
            </tr>
          </thead>

          <tbody>
            {alerts.map((alert) => (
              <tr
                key={alert.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">
                      {alert.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {alert.description}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      severityColors[alert.severity]
                    }`}
                  >
                    {alert.severity}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {alert.status}
                </td>

                <td className="px-4 py-3 text-sm text-gray-500">
                  {alert.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}