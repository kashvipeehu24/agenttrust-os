import { useMonitoring } from "../hooks/useMonitoring";

export default function TransactionTable() {
  const { events } = useMonitoring();

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold">
          Recent Transactions
        </h2>

        <p className="text-sm text-gray-500">
          Live blockchain transaction monitoring.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Transaction
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Status
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Value
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium">
                  {event.type}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      event.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>

                <td className="px-4 py-3 font-medium">
                  {event.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}